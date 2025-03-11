// For the Pattern design screen
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'


const Design = () => {

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
                <button>+ Create new patern</button>

                <h3>My patterns: </h3>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Design
