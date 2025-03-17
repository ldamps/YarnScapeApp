// For the user profile screen
import { useNavigate } from 'react-router-dom';
import { FaCog, FaArrowCircleLeft } from 'react-icons/fa';
import './styles.css';
import React, { useEffect, useState } from 'react';
import BottomNav from '../components/bottomNav';
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { getDocs, query, where, collection, doc, updateDoc } from 'firebase/firestore';

interface Pattern {
    id: string;
    title: string;
    published: boolean;
}

interface TrackingProject {
    id: string;
    title: string;
    completed: boolean;
    lastEdited: string;
}

const Userprofile = () => {
    const auth = getAuth();
    const user = auth.currentUser; // the current user

    const [myPatterns, setMyPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [trackingProjects, setTrackingProjects] = useState<TrackingProject[]>([]);
    const [loadingTracking, setLoadingTracking] = useState(true);

    const navigate = useNavigate();
    const navigateToSettings = () => {
        navigate('/settings');
    };

    // List the current user's patterns, including their published status
    useEffect(() => {
        if (user) {
            const fetchMyPatterns = async () => {
            const q = query(collection(db, 'my-patterns'), where('userId', '==', user.uid));

            const querySnapshot = await getDocs(q);
            const myPatternList: Pattern[] = [];
            querySnapshot.forEach((doc) => {
                const data = doc.data();
                if (data.title) {
                    myPatternList.push({
                        id: doc.id,
                        title: data.title,
                        published: data.published || false, // Ensure "published" is available
                    });
                }
            });
            setMyPatterns(myPatternList);
            setLoading(false);
            };
        fetchMyPatterns();
        }
    }, [db, user]);

    // Fetch the user's tracking projects
    useEffect(() => {
        if (user) {
            const fetchTrackingProjects = async () => {
                const q = query(collection(db, 'tracking-projects'), where('userId', '==', user.uid));
                const querySnapshot = await getDocs(q);
                const trackingProjectList: TrackingProject[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    trackingProjectList.push({
                        id: doc.id,
                        title: data.title,
                        completed: data.completed || false,
                        lastEdited: data.lastEdited?.toDate().toISOString() || '', // Store last edited date
                    });
                });
                setTrackingProjects(trackingProjectList);
                setLoadingTracking(false);
            };
            fetchTrackingProjects();
        }
    }, [user, db]);

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('userprofile');

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    // Handle Publish/Unpublish and Edit button actions
    const handlePublishUnpublish = async (patternId: string, isPublished: boolean) => {
        const patternRef = doc(db, 'my-patterns', patternId);
        await updateDoc(patternRef, {
            published: !isPublished, // Toggle published status
        });
        // Re-fetch patterns after update
        const updatedPatterns = myPatterns.map((pattern) =>
            pattern.id === patternId ? { ...pattern, published: !isPublished } : pattern
        );
        setMyPatterns(updatedPatterns);
    };

    const handleEdit = (patternId: string) => {
        navigate(`/edit/${patternId}`);
    };

    // Handle Mark as Complete and Continue Tracking
    const handleMarkComplete = async (projectId: string) => {
        try {
            const projectRef = doc(db, 'tracking-projects', projectId);
            await updateDoc(projectRef, {
                completed: true,
                lastEdited: new Date(),
            });

            // Update the UI immediately
            setTrackingProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId ? { ...project, completed: true, lastEdited: new Date().toISOString() } : project
                )
            );
            alert('Project marked as completed!');
        } catch (error) {
            console.error('Error marking project as completed:', error);
            alert('There was an error marking the project as completed.');
        }
    };

    const handleContinueTracking = (projectId: string) => {
        navigate(`/tracking/${projectId}`); // Redirect to the track page
    };

    const handleViewProject = (projectId: string) => {
        navigate(`/tracking/${projectId}`); // Redirect to the track page to view the project
    };

    return (
        <div className="profile-container">

            <div className="profile-header">
                <h1>User Profile</h1>
                <div className="setting-icon" onClick={navigateToSettings}>
                    <FaCog size={30} />
                </div>
            </div>

            <div className="profile-body">
                <div className="my-projects">
                    <h2>My Projects: </h2>
                    <div className="trackingProjects-container">
                        {loadingTracking ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="trackingProjects-column">
                                {trackingProjects.length > 0 ? (
                                    <ul>
                                        {trackingProjects.map((project) => (
                                            <li key={project.id}>
                                                <div className="trackingProject-item">
                                                    <span>{project.title}</span>
                                                    
                                                    <div className="trackingProject-actions">
                                                        {project.completed ? (
                                                            <button onClick={() => handleViewProject(project.id)}>View Project</button>
                                                        ) : (
                                                            <>
                                                                <button onClick={() => handleContinueTracking(project.id)}>Continue Tracking</button>
                                                                <button onClick={() => handleMarkComplete(project.id)}>Mark as Complete</button>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p>No tracking projects found.</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="my-patterns">
                    <h2>My Patterns: </h2>
                    <div className="myPatterns-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className="myPatterns-column">
                                {myPatterns.length > 0 ? (
                                    <ul>
                                        {myPatterns.map((pattern) => {
                                            // Check if this pattern has been tracked (but not completed)
                                            const isTracked = trackingProjects.some(
                                                (project) => project.title === pattern.title && !project.completed
                                            );

                                            // Check if this pattern is tracked and completed
                                            const isPatternCompleted = trackingProjects.some(
                                                (project) => project.title === pattern.title && project.completed
                                            );

                                            return (
                                                <li key={pattern.id}>
                                                    <div className="myPatterns-item">
                                                        <span>{pattern.title}</span>
                                                        <div className="myPatterns-columnbtns">
                                                            {pattern.published ? (
                                                                <button onClick={() => handlePublishUnpublish(pattern.id, pattern.published)}>Unpublish</button>
                                                            ) : (
                                                                <button onClick={() => handleEdit(pattern.id)}>Edit</button>
                                                            )}

                                                            {/* Conditionally render Track button */}
                                                            {(!isTracked && !isPatternCompleted) && (
                                                                <button>Track</button> // Show "Track" if not tracked or not completed
                                                            )}
                                        
                                                            <button>Delete</button>
                                                        </div>
                                                    </div>
                                                </li>
                                            );
                                        })}
                                    </ul>
                                ) : (
                                    <p>No patterns</p>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <div className="saved-patterns">
                    <h2>Saved patterns: </h2>
                </div>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default Userprofile;