// For the Find pattern screen - library of free patterns created by other YarnScape users
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/bottomNav';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs, where } from 'firebase/firestore';
import './styles.css';

interface Pattern {
    id: string;
    title: string;
    author: string;
    type: string; // e.g., 'crochet', 'knitting'
    skillLevel: string; // e.g., 'beginner', 'intermediate', 'advanced'
    published: boolean;
    coverImageUrl?: string;
}

const Library = () => {
    const navigate = useNavigate();
    const auth = getAuth();
    const user = auth.currentUser; // The current logged-in user
    const [patterns, setPatterns] = useState<Pattern[]>([]); // Store fetched patterns
    const [searchQuery, setSearchQuery] = useState<string>(''); // Search query
    const [selectedType, setSelectedType] = useState<string>(''); // Filter by type (crochet, knitting, etc.)
    const [selectedSkillLevel, setSelectedSkillLevel] = useState<string>(''); // Filter by skill level
    const [filteredPatterns, setFilteredPatterns] = useState<Pattern[]>(patterns); // Patterns after applying search/filter
    

    useEffect(() => {
        const fetchPatterns = async () => {
            try {
                // Query to get published patterns excluding the current user's patterns
                const patternsRef = collection(db, 'published-patterns');
                const q = query(patternsRef, where('published', '==', true));
                const querySnapshot = await getDocs(q);
                const fetchedPatterns: Pattern[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    fetchedPatterns.push({
                        id: doc.id,
                        title: data.title,
                        author: data.author,
                        type: data.type,
                        skillLevel: data.skillLevel,
                        published: data.published,
                        coverImageUrl: data.coverImageUrl,
                    });
                });
                setPatterns(fetchedPatterns);
            } catch (error) {
                console.error('Error fetching patterns:', error);
            }
        };

        fetchPatterns();
    }, [user?.uid]); // Only run when the user's ID changes

    useEffect(() => {
        // Apply search and filter every time a search/filter changes
        const filtered = patterns.filter((pattern) => {
            const matchesSearchQuery =
                pattern.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                pattern.author.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesType = selectedType ? pattern.type.toLowerCase() === selectedType.toLowerCase() : true;
            const matchesSkillLevel =
                selectedSkillLevel ? pattern.skillLevel.toLowerCase() === selectedSkillLevel.toLowerCase() : true;

            return matchesSearchQuery && matchesType && matchesSkillLevel;
        });
        setFilteredPatterns(filtered);
    }, [searchQuery, selectedType, selectedSkillLevel, patterns]);

    const [currentTab, setCurrentTab] = useState('library');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    // Handle redirecting to pattern detail page
    const handlePatternClick = (patternId: string) => {
        navigate(`/pattern/${patternId}`);
    };

    // Handle saving the pattern (implement save functionality as needed)
    const handleSavePattern = (patternId: string) => {
        console.log('Pattern saved:', patternId);
        // Implement save functionality here, for example, saving it to a list of saved patterns
    };

    return (
        <div className="library-container">
            <h1>Pattern Library</h1>

            {/* Search Bar */}
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Search by pattern name or author"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Filter Options */}
            <div className="filter-options">
                <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
                    <option value="">All Types</option>
                    <option value="crochet">Crochet</option>
                    <option value="knitting">Knitting</option>
                </select>

                <select value={selectedSkillLevel} onChange={(e) => setSelectedSkillLevel(e.target.value)}>
                    <option value="">All Skill Levels</option>
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                </select>
            </div>

            {/* Pattern List */}
            <div className="patterns-list">
                {filteredPatterns.length === 0 ? (
                    <p>No patterns found.</p>
                ) : (
                    filteredPatterns.map((pattern) => (
                        <div key={pattern.id} className="pattern-card">
                            {/* Show cover image or "No Photo" box */}
                            <div className="pattern-photo">
                                {pattern.coverImageUrl ? (
                                    <img src={pattern.coverImageUrl} alt={pattern.title} />
                                ) : (
                                    <div className="no-photo-box">No Photo</div>
                                )}
                            </div>
                            <h3 className="pattern-title" onClick={() => handlePatternClick(pattern.id)}>
                                {pattern.title}
                            </h3>
                            <p>Author: {pattern.author}</p>
                            <p>Type: {pattern.type}</p>
                            {/* Save button */}
                            <button onClick={() => handleSavePattern(pattern.id)} className="save-button">
                                save
                            </button>
                        </div>
                    ))
                )}
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};


export default Library
