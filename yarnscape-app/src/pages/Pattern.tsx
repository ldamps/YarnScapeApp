// Pattern in more detail
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './styles.css';
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc, setDoc } from 'firebase/firestore';

// Interface to represent sections
interface Section {
    title: string;
    instructions: string;
    photoUrls?: string[]; // Optional photo URL
}

// Interface to represent the current pattern
interface thisPattern {
    id: string;
    title: string;
    type: 'crochet' | 'knitting';
    sections: Section[];
    tags: string[];
    materials: string[];
    published: boolean;
    skillLevel: 'beginner' | 'intermediate' | 'advanced';
}

// Interface to represent the reviews
interface Review {
    content: string;
    timestamp: string;
}

const Pattern = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const user = auth.currentUser;
    const { patternId } = useParams<{ patternId: string }>(); // Fetch the pattern ID from the URL
    const [pattern, setPattern] = useState<thisPattern | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [isSaved, setIsSaved] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [reviews, setReviews] = useState<Review[]>([]); // State to hold reviews

    // navigate back to the previous page
    const handleGoBack = () => {
        navigate(-1);
    };

    useEffect(() => {
        // get the current pattern which is being displayed
        if (!patternId) {
            // make sure a patternid has been parsed
            setError('Pattern ID is missing.');
            setLoading(false);
            return;
        }

        const fetchPatternDetails = async () => {
            try {
                // Try fetching the pattern from the 'published-patterns' collection first
                let patternRef = doc(db, 'published-patterns', patternId);
                let patternDoc = await getDoc(patternRef);

                // If not found in published-patterns, try the saved-patterns collection
                if (!patternDoc.exists()) {
                    patternRef = doc(db, 'saved-patterns', patternId);
                    patternDoc = await getDoc(patternRef);
                }

                if (patternDoc.exists()) {
                    const patternData = patternDoc.data();
                    setPattern({
                        id: patternDoc.id,
                        title: patternData.title,
                        type: patternData.type,
                        skillLevel: patternData.skillLevel,
                        sections: patternData.sections,
                        tags: patternData.tags,
                        materials: patternData.materials,
                        published: patternData.published ?? true, // Assuming saved patterns have `published` as true if not specified
                    });

                    // If the user is logged in, check if this pattern is saved
                    if (user) {
                        const savedPatternsRef = collection(db, 'saved-patterns');
                        const q = query(savedPatternsRef, where('userId', '==', user.uid), where('patternId', '==', patternId));
                        const querySnapshot = await getDocs(q);
                        if (!querySnapshot.empty) {
                            setIsSaved(true); // Pattern is saved by the user
                        }
                    }

                    // Fetch reviews for this pattern
                    const reviewsSnapshot = await getDoc(patternRef);
                    const reviewsData = reviewsSnapshot.data()?.reviews || [];
                    setReviews(reviewsData);

                } else {
                    setError('Pattern not found.');
                    console.log(error);
                }
            } catch (err) {
                setError('Error fetching pattern details.');
                console.log(error);
            } finally {
                setLoading(false);
            }
        };

        if (patternId) {
            fetchPatternDetails();
        }
    }, [patternId]);

    // function to save the pattern
    const handleSavePattern = async () => {
        if (user && pattern) {
            const savedPatternRef = doc(db, 'saved-patterns', `${user.uid}-${pattern.id}`);
            await setDoc(savedPatternRef, { // copy the entire pattern to 'saved-patterns'
                userId: user.uid,
                patternId: pattern.id,
                title: pattern.title,
                type: pattern.type,
                skillLevel: pattern.skillLevel,
                sections: pattern.sections,
                tags: pattern.tags,
                materials: pattern.materials,
                published: pattern.published,
            });
            setIsSaved(true); // Mark as saved after saving
        }
    };

    // function to unsave the pattern
    const handleUnsavePattern = async () => {
        if (user && pattern) { // delete the pattern from 'saved-patterns'
            const savedPatternRef = doc(db, 'saved-patterns', `${user.uid}-${pattern.id}`);
            await deleteDoc(savedPatternRef); // Remove saved pattern
            setIsSaved(false); // Mark as unsaved after removing
        }
    };

    // function to go and track the pattern
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
                const patternRef = doc(db, 'published-patterns', patternId);
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
                    author: patternData.author,
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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

    if (!pattern) return <div>No pattern found</div>;

    return (
        <div className="pattern-details-container">
            <div className="pattern-details">
                <div className="back-icon" onClick={handleGoBack}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="1x" />
                </div>
                <h1>{pattern.title}</h1>

                <div className="pattern-facts">
                    <p><strong>Type:</strong> {pattern.type}</p>
                    <p><strong>Skill Level:</strong> {pattern.skillLevel}</p>
                </div>

                <div className="pattern-sections">
                    <h2>Sections:</h2>
                    {pattern.sections.map((section, index) => (
                        <div key={index} className="section">
                            <h3>{section.title}</h3>
                            <div>
                                {/* Split instructions by newline and display each line separately */}
                                {section.instructions.split('\n').map((line, lineIndex) => (
                                    <p key={lineIndex}>{line}</p>
                                ))}
                            </div>
                            {/* Check if photoUrls is available and iterate through them */}
                            {section.photoUrls && section.photoUrls.length > 0 && (
                                <div className="section-photos">
                                    {section.photoUrls.map((photoUrl, photoIndex) => (
                                        <img
                                            key={photoIndex}
                                            src={photoUrl}
                                            alt={`${section.title} photo ${photoIndex + 1}`}
                                            className="section-photo"
                                        />
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="pattern-material">
                    <h2>Materials Needed:</h2>
                    <ul>
                        {pattern.materials.map((material, index) => (
                            <li key={index}>{material}</li>
                        ))}
                    </ul>
                </div>

                <div className="pattern-tags">
                    <h2>Tags:</h2>
                    <ul>
                        {pattern.tags.map((tag, index) => (
                            <li key={index}>{tag}</li>
                        ))}
                    </ul>
                </div>

                <div className="pattern-buttons">
                    {/* Save Button if not saved, and Unsave Button if saved */}
                    {!isSaved && user && (
                        <button onClick={handleSavePattern}>Save Pattern</button>
                    )}
                    {isSaved && user && (
                        <button onClick={handleUnsavePattern}>Unsave Pattern</button>
                    )}
                    <button onClick={() => handleTrack(pattern.id)}>Track</button>
                </div>

                {/* Display reviews */}
                <div className="pattern-reviews">
                    <h2>Reviews:</h2>
                    {reviews.length > 0 ? (
                        <ul>
                            {reviews.map((review, index) => (
                                <li key={index}>
                                    <p><strong>{new Date(review.timestamp).toLocaleString()}</strong></p>
                                    <p>{review.content}</p>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p>No reviews yet.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Pattern;

