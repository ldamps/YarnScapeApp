// For Inventory management screen
import React, { useState, useEffect } from 'react';
import BottomNav from '../components/bottomNav';
import './styles.css'
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';
import AddYarnModal from '../components/addYarn';
import AddToolModal from '../components/addTool';

interface Tool {
    id: string;
    toolName: string;
    type: string;
    quantity: number;
}

interface Yarn {
    id: string;
    yarnName: string;
    type: string;
    colour: string;
    quantity: number;
}


const Inventory = () => {
    const auth = getAuth();
    const [isYarnModalOpen, setIsYarnModalOpen] = useState(false);
    const [isToolModalOpen, setIsToolModalOpen] = useState(false);
    const [toolInventory, setToolInventory] = useState<Tool[]>([]);
    const [yarnInventory, setYarnInventory] = useState<Yarn[]>([]);
    const [loading, setLoading] = useState(true);

    const user = auth.currentUser; // the current signed in user
    
    // fetch the user's yarn inventory from firestore
    useEffect(() => {
        if (user) {
            const fetchYarnInventory = async () => {
                const q = query(
                    collection(db, 'yarn-inventory'),
                    where('userId', '==', user.uid)
                );

                const querySnapshot = await getDocs(q);
                const yarnList: Yarn[] = [];
                querySnapshot.forEach((doc) => {
                    yarnList.push({ id: doc.id, ...doc.data() } as Yarn);
                });
                setYarnInventory(yarnList);
                setLoading(false);
            };

            fetchYarnInventory();

            const fetchToolInventory = async () => {
                const q = query(
                    collection(db, 'tool-inventory'),
                    where('userId', '==', user.uid)
                );

                const querySnapshot = await getDocs(q);
                const toolList: Tool[] = [];
                querySnapshot.forEach((doc) => {
                    toolList.push({ id: doc.id, ...doc.data() } as Tool);
                    setToolInventory(toolList);
                    setLoading(false);
                })
            };
            
            fetchToolInventory();
        }
    }, [db, user]);

    // update the yarn quantity
    const handleQuantityChange = async (id: string, action: 'increase' | 'decrease') => {
        const yarnDocRef = doc(db, 'yarn-inventory', id);
        const yarn = yarnInventory.find(yarn => yarn.id === id);

        if (!yarn) {
            console.error(`Yarn with id ${id} not found`);
            return; // Prevent error if yarn is not found
        }

        const newQuantity = action === 'increase' ? yarn.quantity + 1 : yarn.quantity - 1;
        if (newQuantity < 0) return; // Prevent negative quantities

        try {
            await updateDoc(yarnDocRef, { quantity: newQuantity });

            // Update local state
            setYarnInventory(prevInventory =>
                prevInventory.map(yarn =>
                    yarn.id === id ? { ...yarn, quantity: newQuantity } : yarn
                )
            );
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    // update the tool quantity
    const handleToolQuantityChange = async(id: string, action: 'increase' | 'decrease') => {
        const toolDocRef = doc(db, 'tool-inventory', id);
        const tool = toolInventory.find(tool => tool.id === id);

        if (!tool) {
            console.error(`Tool with id ${id} not found`);
            return;
        }
        
        const newQuantity = action === 'increase' ? tool.quantity + 1 : tool.quantity - 1;
        if (newQuantity < 0) return;

        try {
            await updateDoc(toolDocRef, { quantity: newQuantity });

            setToolInventory(prevInventory =>
                prevInventory.map(tool =>
                    tool.id === id ? { ...tool, quantity: newQuantity} : tool
                )
            )
        } catch (error) {
            console.error('Error updating quantity:', error)
        }
    };


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
                <button className="addToolBtn" onClick={() => setIsToolModalOpen(true)}>Add Tool</button>
                <AddToolModal
                isOpen={isToolModalOpen}
                onClose={() => setIsToolModalOpen(false)}
                setToolInventory={setToolInventory}
                user={user}/>

                <div className="tool-inventory">
                    {/* Display the list of tool items */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                    <ul>
                        {toolInventory.map((tool) => (
                            <li key={tool.id}> {/* Use the yarn.id as a unique key */}
                                <strong>{tool.toolName}</strong> ({tool.type})
                                <div className="quantity">
                                    <button onClick={() => handleToolQuantityChange(tool.id, 'increase')}>+</button>
                                    <span>{tool.quantity}</span>
                                    <button onClick={() => handleToolQuantityChange(tool.id, 'decrease')}>-</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

            <div className="yarn-inventory">
                <h3>Yarn: </h3>
                <button className="addYarnBtn" onClick={() => setIsYarnModalOpen(true)}>Add Yarn</button>
                <AddYarnModal
                isOpen={isYarnModalOpen}
                onClose={() => setIsYarnModalOpen(false)}
                setYarnInventory={setYarnInventory}
                user={user}/>

                <div className="yarn">
                    {/* Display the list of yarn items */}
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                    <ul>
                        {yarnInventory.map((yarn) => (
                            <li key={yarn.id}> {/* Use the yarn.id as a unique key */}
                                <strong>{yarn.yarnName}</strong> ({yarn.type}, {yarn.colour})
                                <div className="quantity">
                                    <button onClick={() => handleQuantityChange(yarn.id, 'increase')}>+</button>
                                    <span>{yarn.quantity}</span>
                                    <button onClick={() => handleQuantityChange(yarn.id, 'decrease')}>-</button>
                                </div>
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
            </div>

            <BottomNav currentTab={currentTab} onTabChange={handleTabChange} />
        </div>
    )
}

export default Inventory
