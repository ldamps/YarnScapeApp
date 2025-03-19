// For the Tracking of a project screen
import React, { useState, useEffect } from 'react';
import { db } from '../main';
import { doc, getDoc, updateDoc, setDoc, collection, getFirestore } from 'firebase/firestore';
import { useParams, useNavigate } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import axios from 'axios';
import './styles.css'

interface Section {
    title: string;
    instructions: string;
    photoUrl?: string; // Optional photo URL
};

interface TrackingProject {
    userId: string;
    patternId: string;
    title: string;
    type: 'crochet' | 'knitting';
    sections: Section[];
    tags: string[];
    materials: string[];
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
    createdAt: any;
    goal: string;
    timeSpent: number;
    lastEdited: any;
    completed: boolean;
    lastRowIndex: number;
    patternPhotos?: string[];
}

const Tracking = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const db = getFirestore(); // Firestore instance
    const auth = getAuth();
    const user = auth.currentUser;
    const navigate = useNavigate();

    const [loading, setLoading] = useState<boolean>(true);
    const [projectData, setProjectData] = useState<TrackingProject | null>(null);
    const [goal, setGoal] = useState<string>('');
    const [timeSpent, setTimeSpent] = useState<number>(0);
    const [completed, setCompleted] = useState<boolean>(false);
    const [selectedSectionIndex, setSelectedSectionIndex] = useState<number | null>(null);
    const [collapsedSections, setCollapsedSections] = useState<boolean[]>([]);
    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [patternPhotos, setPatternPhotos] = useState<string[]>([]); // For pattern-wide photos

    // Fetch project data on mount
    useEffect(() => {
        if (!projectId) {
            console.error("No projectId provided");
            alert("Project ID is missing. Please check the URL.");
            navigate("/track");
            return;
        }

        const fetchProject = async () => {
            try {
                const docRef = doc(db, 'tracking-projects', projectId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const projectData = docSnap.data() as TrackingProject;
                    setProjectData(projectData);
                    setGoal(projectData.goal);
                    setTimeSpent(projectData.timeSpent);
                    setCompleted(projectData.completed);
                    setSelectedRowIndex(projectData.lastRowIndex); // Set the last row index
                    setCollapsedSections(new Array(projectData.sections.length).fill(true)); // Set collapsible sections state
                    setPatternPhotos(projectData.patternPhotos || []); // Set existing pattern photos from Firestore
                } else {
                    console.error('Pattern not found');
                    alert("Project not found.");
                    navigate("/track");
                }
            } catch (error) {
                console.error('Error fetching project:', error);
                alert('Error fetching project.');
                navigate("/track");
            } finally {
                setLoading(false);
            }
        };

        fetchProject();
    }, [projectId, db, navigate, user]);

    // Handle image upload for the whole pattern
    const handleImageUploadForPattern = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const formData = new FormData();
        formData.append('upload_preset', 'yarnscape-images'); // Replace with your Cloudinary preset

        try {
            const newPatternPhotos = [...patternPhotos]; // Copy the existing pattern photos

            // Loop through files and upload each one to Cloudinary
            for (let i = 0; i < files.length; i++) {
                formData.append('file', files[i]);

                const response = await axios.post('https://api.cloudinary.com/v1_1/dm2icxasv/image/upload', formData);
                const imageUrl = response.data.secure_url;

                // Add the new image URL to the pattern's photoUrls array
                newPatternPhotos.push(imageUrl);
            }

            // Update the patternPhotos state
            setPatternPhotos(newPatternPhotos);
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    // Handle photo removal for the whole pattern
    const handleRemovePatternPhoto = (photoIndex: number) => {
        const updatedPatternPhotos = patternPhotos.filter((_, i) => i !== photoIndex);
        setPatternPhotos(updatedPatternPhotos);
    };


    // Function to update the project data
    const handleUpdateProject = async () => {
        if (!projectId || !projectData) {
            return;
        }
    
        const updatedProjectData = {
            ...projectData,
            goal: goal,
            timeSpent: timeSpent,
            completed: completed,
            lastRowIndex: selectedRowIndex !== null ? selectedRowIndex : projectData.lastRowIndex, // Ensure a valid value for lastRowIndex
            lastEdited: new Date(), patternPhotos: patternPhotos,
        };
    
        try {
            const docRef = doc(db, 'tracking-projects', projectId);
            await updateDoc(docRef, updatedProjectData);
            alert('Project progress saved successfully!');
        } catch (error) {
            console.error('Error saving project progress:', error);
            alert('Error saving project progress.');
        }
    };

    // Handle row click to select or deselect a row
    const handleRowClick = (index: number) => {
        setSelectedRowIndex(index); // Set the selected row index
    };

    // Handle section toggle (collapse/expand)
    const handleCollapseToggle = (index: number) => {
        setCollapsedSections((prevState) =>
            prevState.map((collapsed, i) => (i === index ? !collapsed : collapsed))
        );
    };

    // Loading state and display of the project data
    if (loading) {
        return <div>Loading...</div>;
    }

    if (!projectData) {
        return <div>Project not found</div>;
    }

    return (
        <div className="tracking-page">
            {/* Project Header */}
            <div className="project-header">
                <h1>{projectData.title}</h1>
                <div>
                    <span><strong>Type:</strong> {projectData.type}</span>
                    <span><strong>Skill Level:</strong> {projectData.skillLevel}</span>
                </div>
            </div>

            {/* Goal Input */}
            <div className="goal">
                <label>
                    <strong>Goal:</strong>
                    <input
                        type="text"
                        value={goal}
                        onChange={(e) => setGoal(e.target.value)}
                    />
                </label>
            </div>

            {/* Date and Time Spent */}
            <div className="project-meta">
                <p><strong>Created At:</strong> {projectData.createdAt.toDate().toLocaleDateString()}</p>
                <p><strong>Time Spent:</strong> {timeSpent} hours</p>
            </div>

            {/* Sections */}
            <h2>Sections</h2>
            {projectData.sections.map((section, index) => {
                const instructions = section.instructions.split('\n'); // Split instructions by newlines

                return (
                    <div key={index}>
                        {/* Section Title (Collapsible) */}
                        <div
                            onClick={() => handleCollapseToggle(index)}
                            style={{ cursor: 'pointer', fontWeight: 'bold', padding: '5px 0' }}
                        >
                            {section.title}
                        </div>

                        {/* Section Instructions (Separated by Rows) */}
                        {!collapsedSections[index] && (
                            <div>
                                {instructions.map((instruction, rowIndex) => (
                                    <div
                                        key={rowIndex}
                                        onClick={() => handleRowClick(rowIndex)}
                                        style={{
                                            backgroundColor: selectedRowIndex === rowIndex ? 'lightblue' : 'transparent',
                                            padding: '5px',
                                            cursor: 'pointer',
                                        }}
                                    >
                                        {instruction}
                                    </div>
                                ))}
                                {section.photoUrl && <img src={section.photoUrl} alt={section.title} />}
                            </div>
                        )}
                    </div>
                );
            })}

            {/* Pattern-wide Photos Upload */}
            <div>
                <h3>Upload Photos for the Pattern</h3>
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUploadForPattern}
                />
                {patternPhotos.length > 0 && (
                    <div>
                        <h4>Uploaded Photos:</h4>
                        {patternPhotos.map((url, index) => (
                            <div key={index}>
                                <img src={url} alt="Pattern" style={{ width: 100, height: 100 }} />
                                <button type="button" onClick={() => handleRemovePatternPhoto(index)}>Delete</button>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="actions">
                <button onClick={handleUpdateProject}>Save Progress</button>
                <button onClick={() => navigate('/')}>Back to Home</button>
            </div>
        </div>
    );
};
export default Tracking;