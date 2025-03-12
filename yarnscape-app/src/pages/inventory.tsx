// For Inventory management screen
import React, { useState } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'

interface Tool {
    id: string;
    name: string;
    type: string;
    quantity: number;
}

interface Yarn {
    id: string;
    name: string;
    type: string;
    colour: string;
    quantity: number;
}

const Inventory = () => {

    const [user, setUser] = useState<any>(null); // to store the user data

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

            <div className="tools-inventory">
                <h3>Tools: </h3>
                <button>add new tool</button>

                {/*Tools already listed in the inventory */}

            </div>

            <div className="yarn-inventory">
                <h3>Yarn: </h3>
                <button>add new yarn</button>

                {/*Yarn already listed in the inventory */}
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Inventory
