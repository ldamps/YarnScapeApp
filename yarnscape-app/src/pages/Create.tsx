// For creating a crochet pattern
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import './styles.css'
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Section {
    title: string;
    instructions: string;
    photoUrl?: string; // Optional photo URL
};

interface Pattern {
    id: string;
    title: string;
    sections: Section[];
    tags: string[];
    materials: string[];
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

    // Handle form input changes
    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleTagChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTags(e.target.value.split(',').map(tag => tag.trim())); // Converts comma-separated tags into an array
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

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Save to Firestore
            //await firestore.collection('patterns').add(patternData);
            await addDoc(collection(db, 'my-patterns'), {
                userId: user?.uid, title: title, sections: sections, tags: tags, materials: materials
            })
            alert('Pattern added successfully!');
            // Reset form
            setTitle('');
            setSections([{ title: '', instructions: '', photoUrl: '' }]);
            setTags([]);
            setMaterials([]);
        } catch (error) {
            console.error('Error adding pattern: ', error);
        }
    };

    const handleCancel = () => {
        // reset the form
        setTitle('');
        setSections([{ title: '', instructions: '', photoUrl: '' }]);
        setTags([]);
        setMaterials([]);
        // go back to the design screen
        navigate('/design');
    }

    return (
        <div className="create-container">
            <form onSubmit={handleSubmit}>

                <div className="create-headerSection">
                    <div>
                        <label>Title</label>
                        <input type="text" value={title} onChange={handleTitleChange} required />
                    </div>
                </div>

                <div className="create-body-sections">
                    <label>Sections</label>
                    {sections.map((section, index) => (
                    <div key={index}>
                        <div>
                            <label>Section Title</label>
                            <input type="text" value={section.title} onChange={(e) => handleSectionChange(index, 'title', e.target.value)} required />
                        </div>
                        <div>
                            <label>Instructions</label>
                            <textarea value={section.instructions} onChange={(e) => handleSectionChange(index, 'instructions', e.target.value)} required />
                            <button>Add photo</button>
                        </div>
                        {/*
                        <div>
                            <label>Photo URL (optional)</label>
                            <input type="text" value={section.photoUrl || ''} onChange={(e) => handleSectionChange(index, 'photoUrl', e.target.value)} />
                        </div> */}
                        <button type="button" onClick={() => removeSection(index)}>Remove Section</button>
                    </div>
                    ))}
                    <button type="button" onClick={addSection}>Add Section</button>
                </div>

                <div className="create-optional">
                    <div className="create-tags">
                        <label>Tags (comma separated)</label>
                        <input type="text" value={tags.join(', ')} onChange={handleTagChange} />
                    </div>

                    <div className="create-materials">
                        <label>Materials (comma separated)</label>
                        <input type="text" value={materials.join(', ')} onChange={handleMaterialsChange} />
                    </div>
                </div>

                <button type="submit">Save</button>
                <button>Publish</button>
                <button onClick={handleCancel}>Cancel</button>
            </form>
        </div>
    );
};

export default Create