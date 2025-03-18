// Nav-bar for the bottom of the screen
// -- Home - create - track - library - inventory - user profile
import { FaHome, FaPlusCircle, FaBullseye, FaSearch, FaChartBar, FaUser } from 'react-icons/fa';
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
                <FaHome size={24} />
            </div>
    
            <div className={`nav-item ${currentTab === 'design' ? 'active' : ''}`} onClick={() => handleNav('/design')}>
                <FaPlusCircle size={24} />
            </div>

            <div className={`nav-item ${currentTab === 'track' ? 'active' : ''}`} onClick={() => handleNav('/track')}>
                <FaBullseye size={24} />
            </div>
    
            <div className={`nav-item ${currentTab === 'library' ? 'active' : ''}`} onClick={() => handleNav('/library')}>
                <FaSearch size={24} />
            </div>
        
            <div className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`} onClick={() => handleNav('/inventory')}>
                <FaChartBar size={24} />
            </div>
        
            <div className={`nav-item ${currentTab === 'userprofile' ? 'active' : ''}`} onClick={() => handleNav('/userprofile')}>
                <FaUser size={24} />
            </div>
        </div>
    );
};

export default BottomNav;


/*
import React from 'react';
import { FaHome, FaPlusCircle, FaBullseye, FaSearch, FaYarn, FaUser } from 'react-icons/fa';

interface BottomNavProps {
    currentTab: string;
    onTabChange: (tab: string) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
    return (
        <div className="bottom-nav">
            <div className={`nav-item ${currentTab === '/' ? 'active' : ''}`} onClick={() => onTabChange('/')}>
                <FaHome size={24} />
            </div>
        
            <div className={`nav-item ${currentTab === 'design' ? 'active' : ''}`} onClick={() => onTabChange('design')}>
                <FaPlusCircle size={24} />
            </div>

            <div className={`nav-item ${currentTab === 'track' ? 'active' : ''}`} onClick={() => onTabChange('track')}>
                <FaBullseye size={24} />
            </div>

            <div className={`nav-item ${currentTab === 'library' ? 'active' : ''}`} onClick={() => onTabChange('library')}>
                <FaSearch size={24} />
            </div>

            <div className={`nav-item ${currentTab === 'inventory' ? 'active' : ''}`} onClick={() => onTabChange('inventory')}>
                <FaYarn size={24} />
            </div>

            <div className={`nav-item ${currentTab === 'userprofile' ? 'active' : ''}`} onClick={() => onTabChange('userprofile')}>
                <FaUser size={24} />
            </div>
        </div>
    );
};

export default BottomNav;

*/