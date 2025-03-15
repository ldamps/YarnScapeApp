// For the Find pattern screen - library of free patterns created by other YarnScape users
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/bottomNav';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs, where } from 'firebase/firestore';
import './styles.css'

interface Pattern {
    id: string;
    title: string;
    author: string;
    published: boolean;
}

const Library = () => {
    const auth = getAuth();
    const user = auth.currentUser; // The current logged-in user

    const [publishedPatterns, setPublishedPatterns] = useState<Pattern[]>([]);
    const [filteredPatterns, setFilteredPatterns] = useState<Pattern[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('library');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    // Function to handle the search filter
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);
        filterPatterns(query);
    };

    // Function to filter the patterns based on the search query
    const filterPatterns = (query: string) => {
        const filtered = publishedPatterns.filter((pattern) =>
            pattern.title.toLowerCase().includes(query)
        );
        setFilteredPatterns(filtered);
    };


    // Fetch published patterns from Firestore
    useEffect(() => {
        const fetchPublishedPatterns = async () => {
            if (user) {
                // Query for all published patterns
                const q = query(collection(db, 'published-patterns'));
                const querySnapshot = await getDocs(q);
                const patternsList: Pattern[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    if (data.title && data.userId !== user.uid) { // Exclude the current user's patterns
                        patternsList.push({ id: doc.id, title: data.title, author: data.author, published: data.published });
                    }
                });
                setPublishedPatterns(patternsList);
                setFilteredPatterns(patternsList);
                setLoading(false);
            }
        };

        fetchPublishedPatterns();
    }, [user]);


    return (
        <div className="library-container">
            <div className="library-header">
                <h1>Pattern Library</h1>
            </div>

            <div className="library-filtering">
                <div className="library-searchbar">
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <div className="library-body">
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="pattern-list">
                        {filteredPatterns.length > 0 ? (
                            <ul>
                                {filteredPatterns.map((pattern) => (
                                    <li key={pattern.id}>
                                        <div className="pattern-item">
                                            <span>{pattern.title}</span>
                                            <span> by {pattern.author}</span>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No patterns found.</p>
                        )}
                    </div>
                )}
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};

export default Library
