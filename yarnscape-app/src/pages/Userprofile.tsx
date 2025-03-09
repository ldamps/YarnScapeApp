// For the user profile screen
import { useNavigate } from 'react-router-dom';
import {FaCog, FaArrowCircleLeft} from 'react-icons/fa';
import './styles.css'

const Userprofile = () => {

    const navigate = useNavigate();
    const navigateToSettings = () => {
        navigate('/settings');
    }
    const navigateToHome = () => {
        navigate('/');
    }

    return (
        <div className="profile-container">
            <div className="profile-header">
                <div className="profile-icon" onClick={navigateToHome}>
                    <FaArrowCircleLeft size={30} />
                </div>
                <h1>User Profile</h1>
                <div className="profile-icon" onClick={navigateToSettings}>
                    <FaCog size={30} />
                </div>
            </div>

            <div className="profile-body">
                <div className="my-projects">
                    <h2>My Projects</h2>
                </div>

                <div className="my-patterns">
                    <h2>My Patterns</h2>
                </div>

                <div className="saved-patterns">
                    <h2>Saved patterns</h2>
                </div>
            </div>

            <div className="profile-footer">
                {/* Icon navigation bar */}
            </div>
        </div>
    )
}

export default Userprofile
