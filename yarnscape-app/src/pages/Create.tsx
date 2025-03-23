// For creating a crochet pattern
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './styles.css';
import { getFirestore, collection, addDoc, query, where, getDocs, doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import axios from 'axios';

// interface to represent pattern sections
interface Section {
    title: string;
    instructions: string;
    photoUrls: string[]; // Now an array of photo URLs
};

// interface to represent the pattern being created
interface Pattern {
    id: string;
    title: string;
    type: 'crochet' | 'knitting';
    sections: Section[];
    tags: string[];
    materials: string[];
    published: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
};

// interface to represent badges
interface Badge {
    badgeName: string;
    timestamp: Date;
};

const Create = () => {
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    const [title, setTitle] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([{ title: '', instructions: '', photoUrls: [] }]);
    const [tags, setTags] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [patternType, setPatternType] = useState<'crochet' | 'knitting'>('crochet');
    const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

    // Handle form input changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // change tag
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(',').map(tag => tag.trim()));
    };

    // change materials
    const handleMaterialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterials(e.target.value.split(',').map(material => material.trim()));
    };

    // change/edit sections
    const handleSectionChange = (index: number, key: keyof Section, value: string) => {
        const updatedSections = [...sections];
        updatedSections[index] = { ...updatedSections[index], [key]: value };
        setSections(updatedSections);
    };

    // add a section
    const addSection = () => {
        setSections([...sections, { title: '', instructions: '', photoUrls: [] }]);
    };

    // remove a section
    const removeSection = (index: number) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    // change pattern type
    const handlePatternTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatternType(e.target.value as 'crochet' | 'knitting');
    };

    // Skill level change handler
    const handleSkillLevelChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
        setSkillLevel(level);
    };

    // Handle image upload or capture for multiple images
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
        const files = e.target.files;
        if (!files) return;

        const updatedSections = [...sections];
        const newPhotoUrls: string[] = [];

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('upload_preset', 'yarnscape-images');

            try {
                const response = await axios.post('https://api.cloudinary.com/v1_1/dm2icxasv/image/upload', formData);
                newPhotoUrls.push(response.data.secure_url); // Push new URL into the array
            } catch (error) {
                console.error('Error uploading image:', error);
                alert('Failed to upload image.');
            }
        }

        // Add the new photo URLs to the section's photoUrls
        updatedSections[sectionIndex].photoUrls = [...updatedSections[sectionIndex].photoUrls, ...newPhotoUrls];
        setSections(updatedSections);
    };

    // Handle photo removal
    const handleRemovePhoto = (sectionIndex: number, photoIndex: number) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].photoUrls = updatedSections[sectionIndex].photoUrls.filter((_, i) => i !== photoIndex);
        setSections(updatedSections);
    };

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user?.uid) {
            console.error('User ID is required.');
            return;
        }

        try { // save the pattern to the firestore collection my-patterns
            await addDoc(collection(db, 'my-patterns'), {
                userId: user?.uid,
                title,
                sections,
                tags,
                materials,
                type: patternType,
                published: false,
                skillLevel,
            });

            // Get the current count of patterns the user has created
            const userPatternsQuery = query(collection(db, 'my-patterns'), where('userId', '==', user?.uid));
            const userPatternsSnapshot = await getDocs(userPatternsQuery);
            const userPatternsCount = userPatternsSnapshot.size;

            // Check if user should earn a badge
            if (userPatternsCount === 1) {
                await addBadgeToUser(user.uid, 'Design Rookie');
            } else if (userPatternsCount === 5) {
                await addBadgeToUser(user.uid, 'Pattern Prodigy');
            }

            // Reset form
            setTitle('');
            setSections([{ title: '', instructions: '', photoUrls: [] }]);
            setTags([]);
            setMaterials([]);
            setPatternType('crochet');
            setSkillLevel('beginner');

            // Navigate to the design page
            navigate('/design');
        } catch (error) {
            console.error('Error adding pattern:', error);
        }
    };

    // Function to add badge to user
    const addBadgeToUser = async (userId: string, badgeName: string) => {
        const userBadgesRef = doc(db, 'user-badges', userId);
        const userBadgesDoc = await getDoc(userBadgesRef);
    
        if (userBadgesDoc.exists()) {
            const userBadgesData = userBadgesDoc.data();
            const badges: Badge[] = userBadgesData?.badges || [];  // Explicitly type the badges array
    
            // Check if the badge has already been awarded
            if (!badges.some((badge: Badge) => badge.badgeName === badgeName)) {
                badges.push({ badgeName, timestamp: new Date() });
    
                // Update the user's badges in Firestore
                await updateDoc(userBadgesRef, { badges });
            }
        } else {
            // If user badges document doesn't exist, create one with the first badge
            await setDoc(userBadgesRef, {
                userId,
                badges: [{ badgeName, timestamp: new Date() }],
            });
            alert(`Congratulations! You've earned the "${badgeName}" badge!`);
        }
    };

    // cancel pattern create - clear fields and go back to the design page
    const handleCancel = () => {
        setTitle('');
        setSections([{ title: '', instructions: '', photoUrls: [] }]);
        setTags([]);
        setMaterials([]);
        navigate('/design');
    };

    // to publish a pattern
    const handlePublish = async () => {
        try {
            if (!title.trim()) {
                alert('Please enter a title');
                return;
            }
            for (const section of sections) {
                if (!section.title.trim() || !section.instructions.trim()) {
                    alert('Please make sure all section titles and instructions are filled out.');
                    return;
                }
            }

            // save changes made to the pattern before going to the publishing page
            const docRef = await addDoc(collection(db, 'my-patterns'), {
                userId: user?.uid,
                title,
                sections,
                tags,
                materials,
                type: patternType,
                published: false,
                skillLevel,
            });

            setTitle('');
            setSections([{ title: '', instructions: '', photoUrls: [] }]);
            setTags([]);
            setMaterials([]);
            setPatternType('crochet');
            setSkillLevel('beginner');
            navigate(`/publish/${docRef.id}`); // go to the publish page with this pattern
        } catch (error) {
            console.error('Error saving pattern:', error);
            alert('There was an error while saving the pattern.');
        }
    };

    return (
        <div className="create-container">
            <form onSubmit={handleSubmit}>

                <div className="create-headerSection">
                    <div className="create-patternTitle">
                        <input placeholder='Pattern title...' type="text" value={title} onChange={handleTitleChange} required />
                    </div>

                    <div className="create-patternType">
                        <label>
                            <input type="radio" name="patternType" value="crochet" checked={patternType === 'crochet'} onChange={handlePatternTypeChange} />
                            Crochet
                        </label>
                        <label>
                            <input type="radio" name="patternType" value="knitting" checked={patternType === 'knitting'} onChange={handlePatternTypeChange} />
                            Knitting
                        </label>
                    </div>

                    <div className="create-skillLevel">
                        <label>
                            <input type="radio" name="skillLevel" value="beginner" checked={skillLevel === 'beginner'} onChange={() => handleSkillLevelChange('beginner')} />
                            Beginner
                        </label>
                        <label>
                            <input type="radio" name="skillLevel" value="intermediate" checked={skillLevel === 'intermediate'} onChange={() => handleSkillLevelChange('intermediate')} />
                            Intermediate
                        </label>
                        <label>
                            <input type="radio" name="skillLevel" value="advanced" checked={skillLevel === 'advanced'} onChange={() => handleSkillLevelChange('advanced')} />
                            Advanced
                        </label>
                    </div>
                </div>

                <div className="create-body-sections">
                    <label className="sectionLabel">Sections: </label>
                    {sections.map((section, index) => (
                        <div key={index}>
                            <div>
                                <input type="text" placeholder='section title...' value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} required />
                            </div>
                            <div>
                                <textarea placeholder='section instructions...' value={section.instructions} onChange={(e) => handleSectionChange(index, 'instructions', e.target.value)} required />
                            </div>
                            <div>
                                <input type="file" accept="image/*" multiple onChange={(e) => handleImageUpload(e, index)} />
                                {section.photoUrls.map((photoUrl, photoIndex) => (
                                    <div key={photoIndex}>
                                        <img src={photoUrl} alt="Section" style={{ width: 100, height: 100 }} />
                                        <button className="deletePhotoBtn" type="button" onClick={() => handleRemovePhoto(index, photoIndex)}>Delete Photo</button>
                                    </div>
                                ))}
                            </div>
                            <button className="sectionButton" type="button" onClick={() => removeSection(index)}>Remove Section</button>
                        </div>
                    ))}
                    <button className="sectionButton" type="button" onClick={addSection}>Add Section</button>
                </div>

                <div className="create-optional">
                    <div className="create-tags">
                        <label>Tags (comma separated): </label>
                        <input type="text" value={tags.join(', ')} onChange={handleTagChange} />
                    </div>

                    <div className="create-materials">
                        <label>Materials (comma separated): </label>
                        <input type="text" value={materials.join(', ')} onChange={handleMaterialsChange} />
                    </div>
                </div>

                <div className='createbuttons'>
                    <div className='createbuttons-row'>
                        <button type="submit">Save</button>
                        <button type="button" onClick={handlePublish}>Publish</button>
                    </div>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};



export default Create