// For the setting screen
import { useNavigate } from 'react-router-dom';
import {FaEnvelope, FaArrowCircleLeft} from 'react-icons/fa';
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
                <div className="profile-icon" onClick={navigateToProfile}>
                    <FaArrowCircleLeft size={30} />
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
                <FaEnvelope style={{ marginRight: '8px' }} />
                <span>enquiries@yarnscape.com</span>
            </div>
        </div>
    )
}

export default Settings
