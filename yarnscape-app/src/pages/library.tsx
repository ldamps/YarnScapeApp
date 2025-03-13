// For the Find pattern screen - library of free patterns created by other YarnScape users
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'

const Library = () => {

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('library');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };


    return (
        <div className="library-container">
            <div className="library-header">
                <h1>Pattern Library</h1>
            </div>

            <div className="library-filtering">
                <div className="library-searchbar">
                    <input type="text" placeholder="search..." />
                </div>
            </div>
            
            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Library
