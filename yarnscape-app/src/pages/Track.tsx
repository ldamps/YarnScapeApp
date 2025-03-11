// For the Track Project screen
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'

const Track = () => {

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('track');

    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };


    return (
        <div className="track-container">
            <div className="track-header">
                <h3>Select the project that you would like to keep working on: </h3>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />

        </div>
    )
}

export default Track
