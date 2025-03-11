// For the user profile screen
import { useNavigate } from 'react-router-dom';
import {FaCog, FaArrowCircleLeft} from 'react-icons/fa';
import './styles.css'
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';

const Userprofile = () => {

    const navigate = useNavigate();
    const navigateToSettings = () => {
        navigate('/settings');
    }
    const navigateToHome = () => {
        navigate('/');
    }

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
