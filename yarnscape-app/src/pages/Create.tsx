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
    type: 'crochet' | 'knitting';
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
    const [patternType, setPatternType] = useState<'crochet' | 'knitting'>('crochet'); // default is crochet

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

    const handlePatternTypeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPatternType(e.target.value as 'crochet' | 'knitting');
    };

    // Submit the form
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            // Save to Firestore
            //await firestore.collection('patterns').add(patternData);
            await addDoc(collection(db, 'my-patterns'), {
                userId: user?.uid, title: title, sections: sections, tags: tags, materials: materials, type: patternType
            })
            // Reset form
            setTitle('');
            setSections([{ title: '', instructions: '', photoUrl: '' }]);
            setTags([]);
            setMaterials([]);
            setPatternType('crochet');
            // go to the design page
            navigate('/design');
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

    const handlePublish = async () => {
        try {
            // Save the pattern to Firestore
            const docRef = await addDoc(collection(db, 'my-patterns'), {
                userId: user?.uid,
                title,
                sections,
                tags,
                materials,
                type: patternType,
            });
    
            // Reset form state
            setTitle('');
            setSections([{ title: '', instructions: '', photoUrl: '' }]);
            setTags([]);
            setMaterials([]);
            setPatternType('crochet');
    
            // Redirect to the Publish page with the patternId from Firestore
            navigate(`/publish/${docRef.id}`); // docRef.id is the unique patternId
    
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
                        <button type="button" onClick={handlePublish}>Publish</button> {/* Onclick for Publish */}
                    </div>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Create