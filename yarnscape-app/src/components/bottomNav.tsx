// Nav-bar for the bottom of the screen

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faPlusCircle, faBullseye, faSearch, faChartBar, faUser } from '@fortawesome/free-solid-svg-icons';
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface BottomNavProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    const navigate = useNavigate();

    // Handle navigation when an icon is clicked
    const handleNav = (path: string) => {
        onTabChange(path); // Update the active tab state
        navigate(path); // Navigate to the new route
    };

    return (
        <div className="bottom-nav">
            <div className={`nav-item ${currentTab === 'home' ? 'active' : ''}`} onClick={() => handleNav('/')}>
                <FontAwesomeIcon icon={faHome} size="2x" />
            </div>

            <div className={`nav-item ${currentTab === 'design' ? 'active' : ''}`} onClick={() => handleNav('/design')}>
                <FontAwesomeIcon icon={faPlusCircle} size="2x" />
            </div>

            <div className={`nav-item ${currentTab === 'track' ? 'active' : ''}`} onClick={() => handleNav('/track')}>
                <FontAwesomeIcon icon={faBullseye} size="2x" />
            </div>

            <div className={`nav-item ${currentTab === 'library' ? 'active' : ''}`} onClick={() => handleNav('/library')}>
                <FontAwesomeIcon icon={faSearch} size="2x" />
            </div>

            <div className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`} onClick={() => handleNav('/inventory')}>
                <FontAwesomeIcon icon={faChartBar} size="2x" />
            </div>

            <div className={`nav-item ${currentTab === 'userprofile' ? 'active' : ''}`} onClick={() => handleNav('/userprofile')}>
                <FontAwesomeIcon icon={faUser} size="2x" />
            </div>
        </div>
    );
};

export default BottomNav;