// For the Pattern design screen
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/bottomNav';
import './styles.css'
import { getAuth } from 'firebase/auth';
import { db } from '../main';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Pattern {
    id: string;
    title: string;
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
                                                <button>Edit</button>
                                                <button>Track</button>
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
