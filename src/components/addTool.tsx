import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Tool {
    id: string;
    toolName: string;
    type: string;
    quantity: number;
}

interface AddToolModalProps {
    isOpen: boolean;
    onClose: () => void;
    setToolInventory: React.Dispatch<React.SetStateAction<Tool[]>>;
    user: { uid: string } | null;
}

const AddToolModal: React.FC<AddToolModalProps> = ({ isOpen, onClose, setToolInventory, user }) => {
    const db = getFirestore();
    const [newTool, setNewTool] = useState('');
    const [newType, setNewType] = useState('');
    const [newQuantity, setNewQuantity] = useState(1);

    const handleAddTool = async () => {
        if (newTool.trim() === '' || newType.trim() === '') return;

        try {
            await addDoc(collection(db, 'tool-inventory'), {
                userId: user?.uid,
                toolName: newTool,
                type: newType,
                quantity: newQuantity,
                createdAt: new Date(),
            });

            // refresh the inventory list
            setToolInventory((prevInventory) => [
                ...prevInventory,
                { toolName: newTool, type: newType, quantity: newQuantity } as Tool,
            ]);
            setNewTool('');
            setNewType('');
            setNewQuantity(1);
            onClose();
        } catch (error) {
            console.error('Error adding tool: ', error);
        }
    };

    if (!isOpen) return null; // only render the modal when it is open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Tool</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Tool Name:</label>
                        <input
                            type="text"
                            value={newTool}
                            onChange={(e) => setNewTool(e.target.value)}
                            placeholder="Enter tool name"
                        />
                    </div>
                    <div>
                        <label>Type:</label>
                        <input
                            type="text"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            placeholder="Enter tool type"
                        />
                    </div>
                    <div>
                        <label>Quantity:</label>
                        <input
                            type="number"
                            value={newQuantity}
                            onChange={(e) => setNewQuantity(Number(e.target.value))}
                            min="1"
                        />
                    </div>
                    <div className="modal-buttons">
                        <button type="button" onClick={onClose}>Cancel</button>
                        <button type="button" onClick={handleAddTool}>Add Tool</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddToolModal


