// Screen to publish a pattern where it can then be found on the pattern library
import React, { useState, useEffect } from 'react';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc } from 'firebase/firestore';

const Publish = () => {
    const auth = getAuth();
    const user = auth.currentUser; // the current user
    const navigate = useNavigate();
    const { patternId } = useParams<{ patternId: string }>();

    const [pattern, setPattern] = useState<any>(null); // Store the pattern data
    const [authorName, setAuthorName] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const fetchPattern = async () => {
            if (patternId) {
                const docRef = doc(db, 'my-patterns', patternId);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setPattern(docSnap.data());
                } else {
                    console.log('Pattern not found!');
                    navigate('/design'); // Navigate home if the pattern doesn't exist
                }
            }
        };

        fetchPattern();
    }, [patternId, db, navigate]);

    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthorName(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            setCoverImage(e.target.files[0]);
        }
    };

    const handleAgreeChange = () => {
        setAgreed(!agreed);
    };

    const handlePublish = async () => {
        if (!agreed) {
            alert('You must agree that the pattern is not copyrighted!');
            return;
        }

        if (!patternId) {
            console.error('Pattern ID is required.');
            return;
        }

        try {
            // Handle image upload if necessary (you can upload to Firebase Storage)
            
            // Save the pattern data into the "published-patterns" collection
            await addDoc(collection(db, 'published-patterns'), {
                ...pattern,
                author: authorName,
                
                datePublished: new Date(),
            });

            // update the pattern to published = true
            const patternRef = doc(db, 'my-patterns', patternId);
            await updateDoc(patternRef, {
                published: true, // Set published field to true
            });


            alert('Pattern published successfully!');
            navigate('/patterns'); // Redirect to the page where users can see published patterns
        } catch (error) {
            console.error('Error publishing pattern:', error);
            alert('There was an error while publishing your pattern.');
        }
    };

    const handleCancel = () => {
        if (patternId) {
            navigate(`/edit/${patternId}`); // Redirect to the Edit page with the current patternId
        }
    };

    if (!pattern) {
        return <div>Loading...</div>; // Show loading while pattern is being fetched
    }

    return (
        <div className="publish-container">
            <h1>Confirm Your Pattern</h1>
            <div className='publish-header'>
                <h2>{pattern.title}</h2>
            </div>
            <div className="publish-subheading">
                <p>Type: {pattern.type}</p>
                <p>Sections: {pattern.sections.length}</p>
            </div>

            <div className='publish-author'>
                <label>Author Name</label>
                <input type="text" value={authorName} onChange={handleAuthorChange} required />
            </div>

            <div className="publish-image">
                <label>Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div className="publish-checkbox">
                <label>
                    <input type="checkbox" checked={agreed} onChange={handleAgreeChange} />
                    I agree that this pattern is not copyrighted.
                </label>
            </div>

            <div className="publish-buttons">
                <button onClick={handlePublish} className="publish-button">Publish</button>
                <button onClick={handleCancel} className="cancel-button">Cancel</button>
            </div>
        </div>
    )

}

export default Publish;