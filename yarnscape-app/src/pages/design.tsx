// For the Pattern design screen
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/bottomNav';
import './styles.css'
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc, getDoc } from 'firebase/firestore';

interface Pattern {
    id: string;
    title: string;
    published: boolean;
}


const Design = () => {
    const auth = getAuth();
    const user = auth.currentUser; // the current user

    const [myPatterns, setMyPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);

    // To create a new pattern
    const navigate = useNavigate();
    const navigateToCreate = () => {
        navigate('/create');
    }

    // List of the current user's patterns - fetch the user's patterns from firestore
    useEffect(() => {
        if (user) {
            const fetchMyPatterns = async () => {
                const q = query(collection(db, 'my-patterns'), where('userId', '==', user.uid));

                const querySnapshot = await getDocs(q);
                const myPatternList: Pattern[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.title) {
                        myPatternList.push({ id: doc.id, title: data.title, published: data.published });
                    }
                });
                setMyPatterns(myPatternList);
                setLoading(false);
            };

            fetchMyPatterns();
        }
    }, [db, user]);

    const handleEdit = (patternId: string) => {
        navigate(`/edit/${patternId}`); // Navigate to the edit page with the pattern ID
    };

    const handleTrack = async (patternId: string) => {
        if (!user) {
            // If there's no user, show an error message or redirect to login
            alert('Please log in to track patterns.');
            return;
        }
    
        try {
            // Step 1: Check if the user is already tracking the pattern
            const q = query(collection(db, 'tracking-projects'), where('userId', '==', user.uid), where('patternId', '==', patternId));
            const querySnapshot = await getDocs(q);
    
            if (!querySnapshot.empty) {
                // If the user is already tracking this pattern, get the existing tracking project ID
                const existingTrackingProject = querySnapshot.docs[0];
                const trackingProjectId = existingTrackingProject.id;
    
                // Redirect the user to the track page with the tracking project ID
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
                    createdAt: new Date(),
                    goal: '',
                    timeSpent: 0,
                    lastEdited: new Date(),
                    completed: false,
                };
    
                const trackingProjectRef = await addDoc(collection(db, 'tracking-projects'), newTrackingProject);
    
                // Step 4: Redirect the user to the track page with the new tracking project ID
                navigate(`/tracking/${trackingProjectRef.id}`);
            }
        } catch (error) {
            console.error('Error handling track:', error);
            alert('There was an error tracking the pattern.');
        }
    };

    const handleUnpublish = async (patternId: string) => {
        try {
            // Step 1: Delete from 'published-patterns' collection
            const publishedPatternRef = doc(db, 'published-patterns', patternId);
            await deleteDoc(publishedPatternRef);
    
            // Step 2: Update 'published' field in 'my-patterns' collection to false
            const myPatternRef = doc(db, 'my-patterns', patternId);
            await updateDoc(myPatternRef, {
                published: false,
            });
    
            // Optionally: Update the UI immediately
            setMyPatterns((prevPatterns) =>
                prevPatterns.map((pattern) =>
                pattern.id === patternId ? { ...pattern, published: false } : pattern
                )
            );
    
            alert('Pattern has been unpublished successfully!');
        } catch (error) {
            console.error('Error unpublishing pattern:', error);
            alert('There was an error while unpublishing the pattern.');
        }
    };
    


    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('design');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };


    return (
        <div className="design-container">
            <div className="design-header">
                <h1>Pattern Design</h1>
            </div>

            <div className="design-body">
                <button className="createPattern-button" onClick={navigateToCreate}>+ Create new pattern</button>

                <h3>My patterns: </h3>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className='myPattern-column'>
                        {myPatterns.length > 0 ? (
                            <ul>
                                {myPatterns.map((pattern) => (
                                    <li key={pattern.id}>
                                        <div className="myPattern-item">
                                            <span>{pattern.title}</span>
                                            <div className="myPattern-columnbtns">
                                                {pattern.published ? (
                                                    <button onClick={() => handleUnpublish(pattern.id)}>Unpublish</button> // Show Track if published
                                                ) : (
                                                    <button onClick={() => handleEdit(pattern.id)}>Edit</button> // Show Edit if unpublished
                                                )}

                                                <button onClick={() => handleTrack(pattern.id)}>Track</button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>no patterns</p>
                        )}
                    </div>
                )}
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default Design
