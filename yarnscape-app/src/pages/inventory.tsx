// For Inventory management screen
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'

const Inventory = () => {

    // For the bottom navbar
    const [currentTab, setCurrentTab] = useState('inventory');
    
    const handleTabChange = (tab: string) => {
        setCurrentTab(tab); // Update the active tab
    };

    return (
        <div className="inventory-container">
            <div className="inventory-header">
                <h1>Inventory</h1>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Inventory
