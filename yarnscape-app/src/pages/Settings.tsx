// For the setting screen --> 'change password' and 'delete account' features are not not in MVP so these buttons are not functional
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../main';
import ColorPref from '../preferences/colourPref';
import TextPref from '../preferences/textPref';
import './styles.css'


const Settings = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    // Navigate to privacy policy
    const navigateToPPolicy = () => {
        navigate('/privacypolicy');
    }

    // Navigate to terms+conditions
    const navigateToTermsCons = () => {
        navigate('/termsconditions')
    }

    // Navigate to the user profile
    const navigateToProfile = () => {
        navigate('/userprofile')
    }

    const [userEmail, setUserEmail] = useState<string | null>(null); // consts for the user's email
    const [notificationsEnabled, setNotificationsEnabled] = useState<boolean>(false);

    // Get the current users email and notification preferences
    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
            setUserEmail(user.email); // Get the email if the user is signed in

            // Fetch notification preference from Firestore
            const fetchNotificationPref = async () => {
                const docRef = doc(db, 'users', user.uid);
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setNotificationsEnabled(data.notificationsEnabled || false);
                }
            };
            fetchNotificationPref();
        }
    }, [auth.currentUser]);

    // Function to save notification preferences to Firebase
    const saveNotificationPreferences = async (enabled: boolean) => {
        const user = auth.currentUser;
        if (user) {
            const docRef = doc(db, 'users', user.uid);
            await setDoc(docRef, { notificationsEnabled: enabled }, { merge: true });
        }
    };

    // Function to handle notification toggle
    const handleNotificationToggle = async () => {
        const newNotificationSetting = !notificationsEnabled;
        setNotificationsEnabled(newNotificationSetting);
        await saveNotificationPreferences(newNotificationSetting);
    };

    // Function to sign the current user out and navigate them to the login page
    const handleSignout = async () => {
        try {
            await auth.signOut();
            //window.location.href='/login';
            navigate('/login')
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div className="back-icon" onClick={navigateToProfile}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="1x" />
                </div>
                <h1>Settings and Preferences</h1>
            </div>

            <div className="setting-body-preferences">
                {/* Set Colour mode for app */}
                <div className="colour-mode-preference">
                    <h3>Colour preference: </h3>
                    <ColorPref />

                </div>

                {/* Set text sizes for app */}
                <div className="text-size-preference">
                    <h3>Text-size preference: </h3>
                    <TextPref />
                </div>

                {/* Enable/disable notifications */}
                <div className="notification-preference">
                    <h3>Notifications: </h3>
                    <label className="switch">
                        <input
                            type="checkbox"
                            checked={notificationsEnabled}
                            onChange={handleNotificationToggle}
                        />
                        <span className="slider round"></span>
                    </label>
                    <span>{notificationsEnabled ? "Enabled" : "Disabled"}</span>
                </div>

                {/* Personal details */}
                <div className="personal-details">
                    <h3>Account details: </h3>
                    {userEmail ? (
                        <p>Email: {userEmail}</p>
                    ) : (
                        <p>error...</p>
                    )}
                </div>
            </div>

            <div className="setting-body-buttons">
                {/* Privacy policy */}
                <button onClick={navigateToPPolicy}>Privacy Policy</button>
                {/* Terms + conditions */}
                <button onClick={navigateToTermsCons}>Terms and Conditions</button>
                {/* Change password */}
                <button>Change Password</button>
                {/* Log out */}
                <button onClick={handleSignout}>Log Out</button>
                {/* Delete account*/}
                <button>Delete Account</button>
            </div>

            <div className="settings-footer">
                <FontAwesomeIcon icon={faEnvelope} size="1x" />
                <span>enquiries@yarnscape.com</span>
            </div>
        </div>
    )
}

export default Settings
