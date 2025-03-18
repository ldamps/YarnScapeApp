// For the user profile screen
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './styles.css';
import BottomNav from '../components/bottomNav';
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { getDocs, query, where, collection, doc, updateDoc, addDoc, getDoc, deleteDoc } from 'firebase/firestore';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

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

    const handleTrack = async (patternId: string) => {
            if (!user) {
                alert('Please log in to track patterns.');
                return;
            }
        
            try {
                // Step 1: Check if the user is already tracking the pattern
                const q = query(collection(db, 'tracking-projects'), where('userId', '==', user.uid), where('patternId', '==', patternId));
                const querySnapshot = await getDocs(q);
        
                if (!querySnapshot.empty) {
                    // If the pattern is already being tracked, check if it's completed
                    const existingTrackingProject = querySnapshot.docs[0];
                    const trackingData = existingTrackingProject.data();
        
                    if (trackingData.completed) {
                        alert('You have already completed tracking this pattern.');
                        return; // Don't allow tracking if it's completed
                    }
        
                    // If the pattern is being tracked but not completed, redirect to the tracking page
                    const trackingProjectId = existingTrackingProject.id;
                    navigate(`/tracking/${trackingProjectId}`);
                } else {
                    // Step 2: If not tracking, add a new tracking project for this pattern
                    const patternRef = doc(db, 'my-patterns', patternId);
                    const patternDoc = await getDoc(patternRef);
                    if (!patternDoc.exists()) {
                        alert('Pattern not found.');
                        return;
                    }
        
                    const patternData = patternDoc.data();
        
                    // Step 3: Add the pattern to the tracking-projects collection
                    const newTrackingProject = {
                        userId: user.uid,
                        patternId: patternId,
                        title: patternData?.title,
                        type: patternData?.type,
                        sections: patternData?.sections,
                        tags: patternData?.tags,
                        materials: patternData?.materials,
                        skillLevel: patternData?.skillLevel,
                        createdAt: new Date(),
                        goal: '',
                        timeSpent: 0,
                        lastEdited: new Date(),
                        completed: false,
                        lastRowIndex: 0,
                    };
        
                    const trackingProjectRef = await addDoc(collection(db, 'tracking-projects'), newTrackingProject);
                    console.log('Tracking Project ID:', trackingProjectRef.id); // Add this line for debugging
                    navigate(`/tracking/${trackingProjectRef.id}`);
                }
            } catch (error) {
                console.error('Error handling track:', error);
                alert('There was an error tracking the pattern.');
            }
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

    const handleDelete = async (patternId: string) => {
        if (!user) {
            alert('Please log in to delete patterns.');
            return;
        }

        try {
            // Delete the pattern from 'my-patterns' collection
            const patternRef = doc(db, 'my-patterns', patternId);
            await deleteDoc(patternRef);

            // Delete any related tracking projects from 'tracking-projects' collection
            const q = query(collection(db, 'tracking-projects'), where('patternId', '==', patternId), where('userId', '==', user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                await deleteDoc(doc.ref);
            });

            // Remove the pattern from the state
            const updatedPatterns = myPatterns.filter((pattern) => pattern.id !== patternId);
            setMyPatterns(updatedPatterns);
            alert('Pattern deleted successfully.');
        } catch (error) {
            console.error('Error deleting pattern:', error);
            alert('There was an error deleting the pattern.');
        }
    };

    return (
        <div className="profile-container">

            <div className="profile-header">
                <h1>User Profile</h1>
                <div className="setting-icon" onClick={navigateToSettings}>
                    <FontAwesomeIcon icon={faCog} size="2x" />
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
                                            // Check if this pattern has been tracked (and completed)
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

                                                            {/* Only show Track button if the pattern is not completed */}
                                                            {!isPatternCompleted && (
                                                                <button onClick={() => handleTrack(pattern.id)}>Track</button>
                                                            )}

                                                            <button onClick={() => handleDelete(pattern.id)}>Delete</button>
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