// For the setting screen
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import {FaEnvelope, FaArrowCircleLeft} from 'react-icons/fa';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { getAuth, signOut } from 'firebase/auth';
import ColorPref from '../preferences/colourPref';
import TextPref from '../preferences/textPref';
import './styles.css'


const Settings = () => {
    const auth = getAuth();
    const navigate = useNavigate();
    const navigateToPPolicy = () => {
        navigate('/privacypolicy');
    }
    const navigateToTermsCons = () => {
        navigate('/termsconditions')
    }
    const navigateToProfile = () => {
        navigate('/userprofile')
    }

    const [userEmail, setUserEmail] = useState<string | null>(null);

    useEffect(() => {
        const auth = getAuth();
        const user = auth.currentUser;
    
        if (user) {
          setUserEmail(user.email); // Get the email if the user is signed in
        }
    }, []);


    // Function to sign the current user out
    const handleSignout = async () => {
        try {
            await auth.signOut();
            window.location.href='/login';
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="settings-container">
            <div className="settings-header">
                <div className="back-icon" onClick={navigateToProfile}>
                    <FontAwesomeIcon icon={faArrowAltCircleLeft} size="2x" />
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
                <FontAwesomeIcon icon={faEnvelope} size="2x" />
                <span>enquiries@yarnscape.com</span>
            </div>
        </div>
    )
}

export default Settings
