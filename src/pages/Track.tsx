// For the Track Project screen
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/bottomNav';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, getFirestore } from 'firebase/firestore';
import './styles.css'

interface TrackingProject {
    id: string;
    title: string;
    lastEdited: string;
    completed: boolean;
}

const Track = () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser; // the current user
    const [trackingProjects, setTrackingProjects] = useState<TrackingProject[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

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
                        lastEdited: data.createdAt.toDate().toISOString(), // Store last edited date as ISO string
                        completed: data.completed || false,
                    });
                });
                setTrackingProjects(trackingProjectList);
                setLoading(false);
            };

            fetchTrackingProjects();
        }
    }, [db, user]);

    const handleTrackProjectClick = (projectId: string) => {
        navigate(`/tracking/${projectId}`); // Redirect to the specific project track page
    };

    const handleClearProject = async (projectId: string) => {
        try {
            // Update the project as completed
            const trackingProjectRef = doc(db, 'tracking-projects', projectId);
            await updateDoc(trackingProjectRef, {
                completed: true,
                lastEdited: new Date(), // Set last edited to current date
            });

            // Update the UI
            setTrackingProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId ? { ...project, completed: true, lastEdited: new Date().toISOString() } : project
                )
            );

            alert('Project marked as completed!');
        } catch (error) {
            console.error('Error marking project as completed:', error);
            alert('There was an error completing the project.');
        }
    };

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('track');

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };


    return (
        <div className="track-container">
            <h3>Select the project that you would like to keep working on: </h3>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div className="tracking-projects-list">
                    {trackingProjects.length > 0 ? (
                        trackingProjects.map((project) => (
                            <div key={project.id} className={`project-item ${project.completed ? 'completed' : ''}`}>
                                <span
                                    className="project-title"
                                    onClick={() => handleTrackProjectClick(project.id)}
                                >
                                    {project.title}
                                </span>
                                <span className="project-date">
                                    Last Edited: {new Date(project.lastEdited).toLocaleString()}
                                </span>
                                <button
                                    className="clear-btn"
                                    onClick={() => handleClearProject(project.id)}
                                    disabled={project.completed}
                                >
                                    {project.completed ? 'Completed' : 'Mark as Completed'}
                                </button>
                            </div>
                        ))
                    ) : (
                        <p>No tracking projects found.</p>
                    )}
                </div>
            )}
            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default Track
