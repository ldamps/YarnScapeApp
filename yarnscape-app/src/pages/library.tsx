// For the Find pattern screen - library of free patterns created by other YarnScape users
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '../components/bottomNav';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { collection, query, getDocs, where, deleteDoc, addDoc } from 'firebase/firestore';
import './styles.css';

interface Pattern {
    id: string;
    title: string;
    author: string;
    type: string; // e.g., 'crochet', 'knitting'
    skillLevel: string; // e.g., 'beginner', 'intermediate', 'advanced'
    published: boolean;
    coverImageUrl?: string;

    sections?: string[]; // Sections of the pattern
    tags?: string[]; // Tags related to the pattern
    materials?: string[]; // Materials required for the pattern
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
    const [savedPatterns, setSavedPatterns] = useState<Set<string>>(new Set()); // Track saved patterns by ID
    

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
                        sections: data.sections, // Assuming 'sections' is available
                        tags: data.tags, // Assuming 'tags' is available
                        materials: data.materials, // Assuming 'materials' is available
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

    useEffect(() => {
        const fetchSavedPatterns = async () => {
            if (user?.uid) {
                try {
                    const savedPatternsRef = collection(db, 'saved-patterns');
                    const q = query(savedPatternsRef, where('userId', '==', user.uid));
                    const querySnapshot = await getDocs(q);
                    const savedPatternIds: Set<string> = new Set();
                    querySnapshot.forEach((doc) => {
                        savedPatternIds.add(doc.data().patternId);
                    });
                    setSavedPatterns(savedPatternIds);
                } catch (error) {
                    console.error('Error fetching saved patterns:', error);
                }
            }
        };

        fetchSavedPatterns();
    }, [user?.uid]); // Fetch saved patterns when user changes

    const [currentTab, setCurrentTab] = useState('library');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    // Handle redirecting to pattern detail page
    const handlePatternClick = (patternId: string) => {
        navigate(`/pattern/${patternId}`);
    };

    // Handle saving the pattern
    const handleSavePattern = async (patternId: string) => {
        if (user?.uid) {
            try {
                // Find the pattern from the state (patterns)
                const pattern = patterns.find((p) => p.id === patternId);
                
                if (pattern) {
                    // Save the full pattern details to the saved-patterns collection
                    await addDoc(collection(db, 'saved-patterns'), {
                        userId: user.uid,
                        patternId: pattern.id,
                        title: pattern.title,
                        author: pattern.author,
                        type: pattern.type,
                        skillLevel: pattern.skillLevel,
                        sections: pattern.sections, // Add sections if available
                        tags: pattern.tags, // Add tags if available
                        materials: pattern.materials, // Add materials if available
                        coverImageUrl: pattern.coverImageUrl, // Optional: Save the cover image URL
                        published: pattern.published,
                    });
                    // Update the savedPatterns state with the patternId
                    setSavedPatterns((prev) => new Set(prev).add(pattern.id));
                    console.log('Pattern saved:', pattern.id);
                }
            } catch (error) {
                console.error('Error saving pattern:', error);
            }
        }
    };

    // Handle unsaving the pattern
    const handleUnsavePattern = async (patternId: string) => {
        if (user?.uid) {
            try {
                const savedPatternQuery = query(
                    collection(db, 'saved-patterns'),
                    where('userId', '==', user.uid),
                    where('patternId', '==', patternId)
                );
                const querySnapshot = await getDocs(savedPatternQuery);
                querySnapshot.forEach(async (doc) => {
                    await deleteDoc(doc.ref); // Delete the saved pattern document
                });
                setSavedPatterns((prev) => {
                    const updated = new Set(prev);
                    updated.delete(patternId); // Remove from saved patterns state
                    return updated;
                });
                console.log('Pattern unsaved:', patternId);
            } catch (error) {
                console.error('Error unsaving pattern:', error);
            }
        }
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
                            {/* Save or Unsave button */}
                            {savedPatterns.has(pattern.id) ? (
                                <button onClick={() => handleUnsavePattern(pattern.id)} className="unsave-button">
                                    Unsave
                                </button>
                            ) : (
                                <button onClick={() => handleSavePattern(pattern.id)} className="save-button">
                                    Save
                                </button>
                            )}
                        </div>
                    ))
                )}
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    );
};


export default Library
