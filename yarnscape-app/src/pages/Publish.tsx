// Screen to publish a pattern where it can then be found on the pattern library
import React, { useState, useEffect } from 'react';
import { db } from '../main';
import { getAuth } from 'firebase/auth';
import { useParams, useNavigate } from 'react-router-dom';
import { getFirestore, doc, getDoc, addDoc, collection, updateDoc, where, query, getDocs, setDoc } from 'firebase/firestore';
import axios from 'axios';

// interface to represent a badge
interface Badge {
    badgeName: string;
    timestamp: Date;
}

const Publish = () => {
    const auth = getAuth();
    const user = auth.currentUser; // the current user
    const navigate = useNavigate();
    const { patternId } = useParams<{ patternId: string }>(); // get patternid from the url

    const [pattern, setPattern] = useState<any>(null); // Store the pattern data
    const [authorName, setAuthorName] = useState('');
    const [coverImage, setCoverImage] = useState<File | null>(null);
    const [coverImageUrl, setCoverImageUrl] = useState<string>(''); // To store uploaded image URL
    const [agreed, setAgreed] = useState(false);

    useEffect(() => {
        const fetchPattern = async () => {
            // get the pattern the user wants to publish from my-patterns collection
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

    // change author
    const handleAuthorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAuthorName(e.target.value);
    };

    // agree that the pattern isn't copyrighted
    const handleAgreeChange = () => {
        setAgreed(!agreed);
    };

    // upload a cover image
    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', 'yarnscape-images'); // Replace with your Cloudinary preset

        try {
            const response = await axios.post('https://api.cloudinary.com/v1_1/dm2icxasv/image/upload', formData);
            const imageUrl = response.data.secure_url;
            setCoverImageUrl(imageUrl); // Set the cover image URL once uploaded
            setCoverImage(file); // Store the file object (optional for later use)
        } catch (error) {
            console.error('Error uploading image:', error);
            alert('Failed to upload image.');
        }
    };

    // remove an image
    const handleRemoveImage = () => {
        setCoverImageUrl(''); // Clear the cover image URL
        setCoverImage(null); // Clear the file object
    };

    // publish the pattern
    const handlePublish = async () => {
        if (!agreed) {
            alert('You must confirm that the pattern is not copyrighted!');
            return;
        }

        if (!patternId) {
            console.error('Pattern ID is required.');
            return;
        }

        try {
            // Update the pattern to published = true
            const patternRef = doc(db, 'my-patterns', patternId);
            await updateDoc(patternRef, {
                published: true, // Set published field to true
            });
            
            // Save the pattern data into the "published-patterns" collection
            await addDoc(collection(db, 'published-patterns'), {
                ...pattern,
                published: true,
                author: authorName,
                coverImageUrl, // Add the uploaded cover image URL
                datePublished: new Date(),
            });

            // Check if this is the user's first published pattern
            const userPublishedPatternsQuery = query(
                collection(db, 'published-patterns'),
                where('userId', '==', user?.uid)
            );
            const userPublishedPatternsSnapshot = await getDocs(userPublishedPatternsQuery);
            const publishedPatternsCount = userPublishedPatternsSnapshot.size;

            // If it's the user's first published pattern, give them a badge
            if (publishedPatternsCount === 1) {
                await addBadgeToUser(user?.uid, 'Publishing Star');
                alert('Congratulations! You\'ve earned the "Publishing Star" badge!');
            }

            alert('Pattern published successfully!');
            navigate('/design'); // Redirect to the page where users can see published patterns
        } catch (error) {
            console.error('Error publishing pattern:', error);
            alert('There was an error while publishing your pattern.');
        }
    };

    // give user a badge
    const addBadgeToUser = async (userId: string | undefined, badgeName: string) => {
        if (!userId) return;
    
        const userBadgesRef = doc(db, 'user-badges', userId);
        const userBadgesDoc = await getDoc(userBadgesRef);
    
        try {
            if (userBadgesDoc.exists()) {
                const userBadgesData = userBadgesDoc.data();
                const badges: Badge[] = userBadgesData?.badges || [];  // Explicitly type the badges array
    
                // Check if the badge has already been awarded
                if (!badges.some((badge: Badge) => badge.badgeName === badgeName)) {
                    badges.push({ badgeName, timestamp: new Date() });
    
                    // Update the user's badges in Firestore
                    await updateDoc(userBadgesRef, { badges });
    
                    // Show an alert that the user has earned a badge
                    alert(`Congratulations! You've earned the "${badgeName}" badge!`);
                }
            } else {
                // If user badges document doesn't exist, create one with the first badge
                await setDoc(userBadgesRef, {
                    userId,
                    badges: [{ badgeName, timestamp: new Date() }],
                });
            }
        } catch (error) {
            console.error('Error adding badge:', error);
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
            <div className='publish-header'>
                <h2>{pattern.title}</h2>
            </div>
            <div className="publish-subheading">
                <p>Type: {pattern.type}</p>
                <p>Sections: {pattern.sections.length}</p>
            </div>

            <div className='publish-author'>
                <label>Author Name: </label>
                <input type="text" value={authorName} onChange={handleAuthorChange} required />
            </div>

            <div className='cover-image-upload'>
                <label>Cover Image (Optional): </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {coverImageUrl && (
                    <div className="cover-image-preview">
                        <img src={coverImageUrl} alt="Cover Preview" style={{ width: '100%', maxWidth: '300px' }} />
                        <button onClick={handleRemoveImage} className="remove-image-button">Remove Image</button>
                    </div>
                )}
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
    );
};

export default Publish;