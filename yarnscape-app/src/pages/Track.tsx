// For the Track Project screen
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/bottomNav';
import { getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs, updateDoc, doc, getFirestore, addDoc, getDoc } from 'firebase/firestore';
import './styles.css'

// Interface to represent the projects
interface TrackingProject {
    id: string;
    title: string;
    lastEdited: string;
    completed: boolean;
    patternid: string;
}

// Interface to represent reviews
interface Review {
    content: string;
    timestamp: string;
}

// Interface to represent badges
interface Badge {
    badgeName: string;
    timestamp: Date;
}

const Track = () => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser; // the current user
    const [trackingProjects, setTrackingProjects] = useState<TrackingProject[]>([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [reviewContent, setReviewContent] = useState('');
    const [selectedPatternId, setSelectedPatternId] = useState<string | null>(null); // Store the selected patternId

    // To fetch the user's tracked projects using the signed in user's id
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
                        patternid: data.patternId,
                    });
                });
                setTrackingProjects(trackingProjectList);
                setLoading(false);
            };
            fetchTrackingProjects();
        }
    }, [db, user]);

    // navigate to tracking when 'track' button is pressed
    const handleTrackProjectClick = (projectId: string) => {
        navigate(`/tracking/${projectId}`); // Redirect to the specific project track page
    };

    // Function to mark the projet as completed
    const handleClearProject = async (projectId: string) => {
        if (!user?.uid) {
            console.error('User ID is required.');
            return;
        };

        try {
            // Update the project as completed, completed=true
            const trackingProjectRef = doc(db, 'tracking-projects', projectId);
            await updateDoc(trackingProjectRef, {
                completed: true,
                lastEdited: new Date(), // Set last edited to current date
            });

            // Update the UI so that it shows it is completed
            setTrackingProjects((prevProjects) =>
                prevProjects.map((project) =>
                    project.id === projectId ? { ...project, completed: true, lastEdited: new Date().toISOString() } : project
                )
            );

            // Check how many projects the user has completed
            const completedProjectsQuery = query(
                collection(db, 'tracking-projects'),
                where('userId', '==', user.uid),
                where('completed', '==', true)
            );
            const completedProjectsSnapshot = await getDocs(completedProjectsQuery);
            const completedProjectsCount = completedProjectsSnapshot.size;

            // Award badge if it's the user's first or fifth completed project
            if (completedProjectsCount === 1) {
                await addBadgeToUser('Project Pioneer');
            } else if (completedProjectsCount === 5) {
                await addBadgeToUser('Project Pro');
            }

            // Determine if this pattern is a published pattern using tracking-projects patternId field
            // Get the patternId of the completed project
            const project = trackingProjects.find((proj) => proj.id === projectId);
            if (!project) return;  // If no project found, exit

            const patternId = project.patternid;

            // Check if the published pattern's ID matches the patternId of the project
            const publishedPatternRef = doc(db, 'published-patterns', patternId); // Directly reference the pattern by its ID
            const patternSnapshot = await getDoc(publishedPatternRef);

            if (patternSnapshot.exists()) {
                // If the published pattern exists, prompt the user to leave a review
                setSelectedPatternId(patternId);
                setIsModalOpen(true);
            }


        } catch (error) {
            console.error('Error marking project as completed:', error);
            alert('There was an error completing the project.');
        }
    };

    // Function to add badges to the user
    const addBadgeToUser = async (badgeName: string) => {
        if (!user?.uid) return;

        const userBadgesRef = doc(db, 'user-badges', user.uid);
        const userBadgesDoc = await getDoc(userBadgesRef);

        try {
            if (userBadgesDoc.exists()) {
                const userBadgesData = userBadgesDoc.data();
                const badges: any[] = userBadgesData?.badges || [];

                // Check if the badge has already been awarded
                if (!badges.some((badge: any) => badge.badgeName === badgeName)) {
                    badges.push({ badgeName, timestamp: new Date() });

                    // Update the user's badges in Firestore
                    await updateDoc(userBadgesRef, { badges });

                    // Show an alert that the user has earned a badge
                    alert(`Congratulations! You've earned the "${badgeName}" badge!`);
                }
            }
        } catch (error) {
            console.error('Error adding badge:', error);
        }
    };

    // Function to handle review submission
    const handleSubmitReview = async () => {
        if (!reviewContent.trim()) {
            alert('Please provide a review before submitting.');
            return;
        }

        try {
            // Add the review as a field in the 'published-patterns' document
            const publishedPatternRef = doc(db, 'published-patterns', selectedPatternId!);

            // Fetch the existing pattern document
            const patternSnapshot = await getDoc(publishedPatternRef);
            if (!patternSnapshot.exists()) {
                alert('Pattern not found!');
                return;
            }

            const patternData = patternSnapshot.data();

            // Ensure that the 'reviews' field exists, if not, initialize it as an empty array
            const existingReviews = patternData?.reviews || [];

            // Add the new review to the reviews array
            const newReview: Review = {
                content: reviewContent,
                timestamp: new Date().toISOString(),
            };

            const updatedReviews = [...existingReviews, newReview];

            // Update the pattern document with the new reviews array
            await updateDoc(publishedPatternRef, {
                reviews: updatedReviews,
            });

            // Close the modal after submission
            setIsModalOpen(false);
            setReviewContent(''); // Clear the review content

            alert('Thank you for your review!');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('There was an error submitting your review.');
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

            {/* Modal for leaving a review */}
            {isModalOpen && (
                <div className="modal">
                    <div className="modal-content">
                        <h4>Leave a Review</h4>
                        <textarea
                            value={reviewContent}
                            onChange={(e) => setReviewContent(e.target.value)}
                            placeholder="Write your review here..."
                        />
                        <button onClick={handleSubmitReview}>Submit Review</button>
                        <button onClick={() => setIsModalOpen(false)}>Close</button>
                    </div>
                </div>
            )}

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default Track
