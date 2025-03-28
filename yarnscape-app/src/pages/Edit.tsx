// Screen to edit a pattern
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import axios from 'axios';

// interface to represent sections of the pattern
interface Section {
    title: string;
    instructions: string;
    photoUrls: string[]; // Array of photo URLs
};

// interface to represent the pattern being tracked
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

const Edit = () => {
    const navigate = useNavigate();
    const { patternId } = useParams<{ patternId: string }>(); // Fetch patternId from URL
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    const [title, setTitle] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([{ title: '', instructions: '', photoUrls: [] }]);
    const [tags, setTags] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [patternType, setPatternType] = useState<'crochet' | 'knitting'>('crochet'); // default is crochet
    const [skillLevel, setSkillLevel] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner'); // default is beginner

    // Fetch the pattern data from 'my-patterns' collection
    useEffect(() => {
        const fetchPattern = async () => {
            if (!patternId) return;

            const docRef = doc(db, 'my-patterns', patternId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const patternData = docSnap.data() as Pattern;
                // Populate the form with the existing pattern data
                setTitle(patternData.title);
                setSections(patternData.sections);
                setTags(patternData.tags);
                setMaterials(patternData.materials);
                setPatternType(patternData.type);
                setSkillLevel(patternData.skillLevel);
            } else {
                console.error('Pattern not found');
            }
        };
        fetchPattern();
    }, [patternId, db]);

    // Handle form input changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    // handle tag changes
    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(',').map(tag => tag.trim())); // Converts comma-separated tags into an array
    };

    // handle material changes
    const handleMaterialsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMaterials(e.target.value.split(',').map(material => material.trim()));
    };

    // handle section changes
    const handleSectionChange = (index: number, key: keyof Section, value: string) => {
        const updatedSections = [...sections];
        updatedSections[index] = { ...updatedSections[index], [key]: value };
        setSections(updatedSections);
    };

    // add a new section
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

    // change skill level
    const handleSkillLevelChange = (level: 'beginner' | 'intermediate' | 'advanced') => {
        setSkillLevel(level);
    };

    // Handle image upload or capture
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, sectionIndex: number) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        formData.append('upload_preset', 'yarnscape-images'); // cloudinary preset name: yarnscape-images

        try {
            // Upload each selected file to Cloudinary
            const uploadedUrls: string[] = [];
            for (const file of files) {
                formData.append('file', file);
                const response = await axios.post('https://api.cloudinary.com/v1_1/dm2icxasv/image/upload', formData); // dm2icxasv is the cloud name
                uploadedUrls.push(response.data.secure_url);
            }

            // Update the section's photoUrls array with the uploaded image URLs
            const updatedSections = [...sections];
            updatedSections[sectionIndex].photoUrls = [...updatedSections[sectionIndex].photoUrls, ...uploadedUrls];
            setSections(updatedSections);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    // Handle photo removal
    const handleRemovePhoto = (sectionIndex: number, photoIndex: number) => {
        const updatedSections = [...sections];
        updatedSections[sectionIndex].photoUrls = updatedSections[sectionIndex].photoUrls.filter((_, i) => i !== photoIndex); // Remove the specific photo URL
        setSections(updatedSections);
    };

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            if (!patternId) return;

            // update the edits so the saved pattern in 'my-patterns' is up to date
            const docRef = doc(db, 'my-patterns', patternId);
            await updateDoc(docRef, {
                title: title,
                sections: sections,
                tags: tags,
                materials: materials,
                type: patternType,
                published: false,
                skillLevel: skillLevel
            });

            // Navigate back to the design page or wherever
            navigate('/design');
        } catch (error) {
            console.error('Error updating pattern: ', error);
        }
    };

    const handleCancel = () => {
        // Navigate back without saving changes
        navigate('/design');
    };

    const handleDelete = async () => {
        if (!patternId) {
            console.error('Pattern ID is missing');
            alert('Pattern ID is missing');
            return;
        }

        const userConfirmed = window.confirm('Are you sure you want to delete this pattern?');

        if (userConfirmed) {
            try {
                // Create a reference to the pattern document using the patternId
                const patternRef = doc(db, 'my-patterns', patternId);
                await deleteDoc(patternRef);
                alert('Pattern deleted successfully!');
                // Navigate to another page (e.g., back to the design page)
                navigate('/design');
            } catch (error) {
                console.error('Error deleting pattern: ', error);
                alert('Error deleting pattern');
            }
        } else {
            // If the user cancels, do nothing
            console.log('Pattern deletion cancelled');
        }
    };

    // to publish a pattern
    const handlePublish = async (e: React.MouseEvent) => {
        e.preventDefault();  // Prevent the form from submitting

        if (!patternId) return;

        try {
            // save changes made to the pattern
            const docRef = doc(db, 'my-patterns', patternId);
            await updateDoc(docRef, {
                patternID: patternId,
                title: title,
                sections: sections,
                tags: tags,
                materials: materials,
                type: patternType,
                published: false, // Mark the pattern as published
                skillLevel: skillLevel,
            });

            // Navigate to the publish page with the selected pattern's id
            navigate(`/publish/${patternId}`);
        } catch (error) {
            console.error('Error publishing pattern: ', error);
            alert('Error publishing pattern');
        }
    };

    return (
        <div className="edit-container">
            <form onSubmit={handleSubmit}>
                <div className="edit-headerSection">
                    <div className="edit-patternTitle">
                        <input
                            placeholder="Pattern title..."
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>
                    <div className="edit-patternType">
                        <label>
                            <input
                                type="radio"
                                name="patternType"
                                value="crochet"
                                checked={patternType === 'crochet'}
                                onChange={handlePatternTypeChange}
                            />
                            Crochet
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="patternType"
                                value="knitting"
                                checked={patternType === 'knitting'}
                                onChange={handlePatternTypeChange}
                            />
                            Knitting
                        </label>
                    </div>
                </div>

                <div className="edit-skillLevel">
                    <label>
                        <input
                            type="radio"
                            name="skillLevel"
                            value="beginner"
                            checked={skillLevel === 'beginner'}
                            onChange={() => handleSkillLevelChange('beginner')}
                        />
                        Beginner
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="skillLevel"
                            value="intermediate"
                            checked={skillLevel === 'intermediate'}
                            onChange={() => handleSkillLevelChange('intermediate')}
                        />
                        Intermediate
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="skillLevel"
                            value="advanced"
                            checked={skillLevel === 'advanced'}
                            onChange={() => handleSkillLevelChange('advanced')}
                        />
                        Advanced
                    </label>
                </div>

                <div className="edit-body-sections">
                    <label className="edit-sectionLabel">Sections: </label>
                    {sections.map((section, index) => (
                        <div key={index}>
                            <div>
                                <input
                                    type="text"
                                    placeholder="Section title..."
                                    value={section.title}
                                    onChange={(e) => handleSectionChange(index, 'title', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <textarea
                                    placeholder="Section instructions..."
                                    value={section.instructions}
                                    onChange={(e) => handleSectionChange(index, 'instructions', e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                {/* Add Image Upload Button */}
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={(e) => handleImageUpload(e, index)}
                                />
                                {/* Display the uploaded images */}
                                {section.photoUrls.length > 0 && (
                                    <div>
                                        {section.photoUrls.map((photoUrl, photoIndex) => (
                                            <div key={photoIndex}>
                                                <img src={photoUrl} alt={`Section ${index} Photo ${photoIndex}`} style={{ width: 100, height: 100 }} />
                                                <button
                                                    className="editDeletePhotoBtn"
                                                    type="button"
                                                    onClick={() => handleRemovePhoto(index, photoIndex)}
                                                >
                                                    Remove Photo
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button className="editSectionBtn" type="button" onClick={() => removeSection(index)}>
                                Remove Section
                            </button>
                        </div>
                    ))}
                    <button className="editSectionBtn" type="button" onClick={addSection}>
                        Add Section
                    </button>
                </div>

                <div className="edit-optional">
                    <div className="create-tags">
                        <label>Tags (comma separated): </label>
                        <input type="text" value={tags.join(', ')} onChange={handleTagChange} />
                    </div>

                    <div className="edit-materials">
                        <label>Materials (comma separated): </label>
                        <input type="text" value={materials.join(', ')} onChange={handleMaterialsChange} />
                    </div>
                </div>

                <div className="editbuttons">
                    <div className="editbuttons-row">
                        <button type="submit">Save</button>
                        <button onClick={handlePublish}>Publish</button>
                    </div>
                    
                    <div className="editbuttons-row2">
                        <button onClick={handleCancel}>Cancel</button>
                        <button onClick={handleDelete}>Delete</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Edit;