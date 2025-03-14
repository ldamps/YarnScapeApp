// Screen to publish a pattern where it can then be found on the pattern library
import React, { useState, useEffect } from 'react';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, addDoc, collection } from 'firebase/firestore';

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

        try {
            // Handle image upload if necessary (you can upload to Firebase Storage)
            
            // Save the pattern data into the "published-patterns" collection
            await addDoc(collection(db, 'published-patterns'), {
                ...pattern,
                author: authorName,
                
                datePublished: new Date(),
            });

            alert('Pattern published successfully!');
            navigate('/patterns'); // Redirect to the page where users can see published patterns
        } catch (error) {
            console.error('Error publishing pattern:', error);
            alert('There was an error while publishing your pattern.');
        }
    };

    if (!pattern) {
        return <div>Loading...</div>; // Show loading while pattern is being fetched
    }

    return (
        <div className="publish-container">
            <h1>Confirm Your Pattern</h1>
            <div>
                <h2>{pattern.title}</h2>
                <p>Type: {pattern.type}</p>
                <p>Sections: {pattern.sections.length}</p>
            </div>

            <div>
                <label>Author Name</label>
                <input type="text" value={authorName} onChange={handleAuthorChange} required />
            </div>

            <div>
                <label>Cover Image</label>
                <input type="file" accept="image/*" onChange={handleImageChange} />
            </div>

            <div>
                <label>
                    <input type="checkbox" checked={agreed} onChange={handleAgreeChange} />
                    I agree that this pattern is not copyrighted.
                </label>
            </div>

            <button onClick={handlePublish}>Publish</button>
            <button>Cancel</button>
        </div>
    )

}

export default Publish;