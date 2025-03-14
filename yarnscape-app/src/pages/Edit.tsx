import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

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

const Edit = () => {
    const navigate = useNavigate();
    const { patternId } = useParams<{ patternId: string }>(); // Fetch patternId from URL
    const db = getFirestore();
    const auth = getAuth();
    const user = auth.currentUser;

    const [title, setTitle] = useState<string>('');
    const [sections, setSections] = useState<Section[]>([{ title: '', instructions: '', photoUrl: '' }]);
    const [tags, setTags] = useState<string[]>([]);
    const [materials, setMaterials] = useState<string[]>([]);
    const [patternType, setPatternType] = useState<'crochet' | 'knitting'>('crochet'); // default is crochet

    // Fetch the pattern data when the component mounts
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
            if (!patternId) return;

            const docRef = doc(db, 'my-patterns', patternId);
            await updateDoc(docRef, {
                title: title,
                sections: sections,
                tags: tags,
                materials: materials,
                type: patternType
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

    return (
        <div className="create-container">
            <form onSubmit={handleSubmit}>
                <div className="create-headerSection">
                    <div className="create-patternTitle">
                        <input
                            placeholder="Pattern title..."
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            required
                        />
                    </div>
                    <div className="create-patternType">
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

                <div className="create-body-sections">
                    <label className="sectionLabel">Sections</label>
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
                                <button>Add photo</button>
                            </div>
                            <button type="button" onClick={() => removeSection(index)}>
                                Remove Section
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={addSection}>
                        Add Section
                    </button>
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

                <div className="createbuttons">
                    <div className="createbuttons-row">
                        <button type="submit">Save</button>
                        <button>Publish</button>
                    </div>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            </form>
        </div>
    );
};

export default Edit;