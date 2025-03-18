import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, doc } from 'firebase/firestore';

interface Yarn {
    id: string;
    yarnName: string;
    type: string;
    colour: string;
    quantity: number;
}

interface AddYarnModalProps {
    isOpen: boolean;
    onClose: () => void;
    setYarnInventory: React.Dispatch<React.SetStateAction<Yarn[]>>;
    user: { uid: string } | null;
}

const AddYarnModal: React.FC<AddYarnModalProps> = ({ isOpen, onClose, setYarnInventory, user }) => {
    const db = getFirestore();
    const [newYarn, setNewYarn] = useState('');
    const [newType, setNewType] = useState('');
    const [newColour, setNewColour] = useState('');
    const [newQuantity, setNewQuantity] = useState(1);

    const handleAddYarn = async () => {
        if (newYarn.trim() === '' || newType.trim() === '' || newColour.trim() === '') return;

        try {
            await addDoc(collection(db, 'yarn-inventory'), {
                userId: user?.uid,
                yarnName: newYarn,
                type: newType,
                colour: newColour,
                quantity: newQuantity,
                createdAt: new Date(),
            });

            // refresh the inventory list
            setYarnInventory((prevInventory) => [
                ...prevInventory,
                { yarnName: newYarn, type: newType, colour: newColour, quantity: newQuantity } as Yarn,
            ]);
            setNewYarn('');
            setNewType('');
            setNewColour('');
            setNewQuantity(1);
            onClose();
        } catch (error) {
            console.error('Error adding yarn: ', error);
        }
    };

    if (!isOpen) return null; // only render the modal when it is open

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Add New Yarn</h2>
                <form onSubmit={(e) => e.preventDefault()}>
                    <div>
                        <label>Yarn Name:</label>
                        <input
                            type="text"
                            value={newYarn}
                            onChange={(e) => setNewYarn(e.target.value)}
                            placeholder="Enter yarn name"
                        />
                    </div>
                    <div>
                        <label>Type:</label>
                        <input
                            type="text"
                            value={newType}
                            onChange={(e) => setNewType(e.target.value)}
                            placeholder="Enter yarn type"
                        />
                    </div>
                    <div>
                        <label>Colour:</label>
                        <input
                            type="text"
                            value={newColour}
                            onChange={(e) => setNewColour(e.target.value)}
                            placeholder="Enter yarn colour"
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
                        <button type="button" onClick={handleAddYarn}>Add Yarn</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddYarnModal


