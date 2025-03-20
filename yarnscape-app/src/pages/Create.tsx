// For creating a crochet pattern
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './styles.css';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import axios from 'axios';

interface Section {
    title: string;
    instructions: string;
    photoUrl?: string; // Optional photo URL
};

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

const Create = () => {
    const navigate = useNavigate();
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    const [title, setTitle] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([{ title: '', instructions: '', photoUrl: '' }]);
    const [tags, setTags] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [patternType, setPatternType] = useState<'crochet' | 'knitting'>('crochet');
    const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');

    // Handle form input changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(',').map(tag => tag.trim()));
    };

    const handleMaterialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterials(e.target.value.split(',').map(material => material.trim()));
    };

    const handleSectionChange = (index: number, key: keyof Section, value: string) => {
        const updatedSections = [...sections];
        updatedSections[index] = { ...updatedSections[index], [key]: value };
        setSections(updatedSections);
    };

    const addSection = () => {
        setSections([...sections, { title: '', instructions: '', photoUrl: '' }]);
    };

    const removeSection = (index: number) => {
        const updatedSections = sections.filter((_, i) => i !== index);
        setSections(updatedSections);
    };

    const handlePatternTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatternType(e.target.value as 'crochet' | 'knitting');
    };

    // Skill level change handler
    const handleSkillLevelChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
        setSkillLevel(level);
    };

    // Handle image upload or capture
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'yarnscape-images'); // Replace with your Cloudinary preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dm2icxasv/image/upload', formData);
            const imageUrl = response.data.secure_url;

            // Update the section's photoUrl
            const updatedSections = [...sections];
            updatedSections[sectionIndex].photoUrl = imageUrl;
            setSections(updatedSections);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    // Handle photo removal
    const handleRemovePhoto = (sectionIndex: number) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].photoUrl = ''; // Clear the photo URL
        setSections(updatedSections);
    };

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
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

            // Reset form
            setTitle('');
            setSections([{ title: '', instructions: '', photoUrl: '' }]);
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

    const handleCancel = () => {
        setTitle('');
        setSections([{ title: '', instructions: '', photoUrl: '' }]);
        setTags([]);
        setMaterials([]);
        navigate('/design');
    };

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
            setSections([{ title: '', instructions: '', photoUrl: '' }]);
            setTags([]);
            setMaterials([]);
            setPatternType('crochet');
            setSkillLevel('beginner');

            navigate(`/publish/${docRef.id}`);
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
                    <label className="sectionLabel">Sections</label>
                    {sections.map((section, index) => (
                        <div key={index}>
                            <div>
                                <input type="text" placeholder='section title...' value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} required />
                            </div>
                            <div>
                                <textarea placeholder='section instructions...' value={section.instructions} onChange={(e) => handleSectionChange(index, 'instructions', e.target.value)} required />
                            </div>
                            <div>
                                <input type="file" accept="image/*" capture="user" onChange={(e) => handleImageUpload(e, index)} />
                                {section.photoUrl && (
                                    <div>
                                        <img src={section.photoUrl} alt="Section" style={{ width: 100, height: 100 }} />
                                        <button className="deletePhotoBtn" type="button" onClick={() => handleRemovePhoto(index)}>Delete Photo</button>
                                    </div>
                                )}
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