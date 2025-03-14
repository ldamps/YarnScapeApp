// For the user profile screen
import { useNavigate } from 'react-router-dom';
import {FaCog, FaArrowCircleLeft} from 'react-icons/fa';
import './styles.css'
import React, { useEffect, useState } from 'react';
import BottomNav from '../components/bottomNav';
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Pattern {
    id: string;
    title: string;
}

const Userprofile = () => {
    const auth = getAuth();
    const user = auth.currentUser; // the current user
    
    const [myPatterns, setMyPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();
    const navigateToSettings = () => {
        navigate('/settings');
    }
    
    // List the current user's patterns
    useEffect(() => {
        if (user) {
            const fetchMyPatterns = async () => {
                const q = query(collection(db, 'my-patterns'), where('userId', '==', user.uid));
    
                const querySnapshot = await getDocs(q);
                const myPatternList: Pattern[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.title) {
                        myPatternList.push({ id: doc.id, title: data.title });
                    }
                });
                setMyPatterns(myPatternList);
                setLoading(false);
            };
    
            fetchMyPatterns();
        }
    }, [db, user]);

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('userprofile');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    return (
        <div className="profile-container">
            {/*<div className="go-back">
                <div className="back-icon" onClick={navigateToHome}>
                    <FaArrowCircleLeft size={30} />
                </div>
            </div> */}

            <div className="profile-header">
                <h1>User Profile</h1>
                <div className="setting-icon" onClick={navigateToSettings}>
                    <FaCog size={30} />
                </div>
            </div>

            <div className="profile-body">
                <div className="my-projects">
                    <h2>My Projects: </h2>
                </div>

                <div className="my-patterns">
                    <h2>My Patterns: </h2>
                    <div className="myPatterns-container">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <div className='myPatterns-column'>
                                {myPatterns.length > 0 ? (
                                    <ul>
                                        {myPatterns.map((pattern) => (
                                            <li key={pattern.id}>
                                                <div className="myPatterns-item">
                                                    <span>{pattern.title}</span>
                                                    <div className="myPatterns-columnbtns">
                                                        <button>Edit</button>
                                                        <button>Track</button>
                                                        <button>Delete</button>
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
                        <h3>Published Patterns: </h3>
                    </div>
                </div>

                <div className="saved-patterns">
                    <h2>Saved patterns: </h2>
                </div>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Userprofile
