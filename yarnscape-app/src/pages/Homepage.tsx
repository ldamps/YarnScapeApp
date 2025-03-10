// For the homepage screen
import { useNavigate } from 'react-router-dom';
import {FaUser} from 'react-icons/fa';
import './styles.css'

const Homepage = () => {

    const navigate = useNavigate();
    const navigateToProfile = () => {
        navigate('/userprofile');
    }
    const navigateToTrack = () => {
        navigate('/track');
    }
    const navigateToDesign = () => {
        navigate('/design');
    }
    const navigateToLibrary = () => {
        navigate('/library');
    }
    const navigateToInventory = () => {
        navigate('/inventory');
    }

    return (
        <div className="homepage-container">
            <div className="homepage-header">
                <h1>Hello!</h1>
                <div className="profile-icon" onClick={navigateToProfile}>
                    <FaUser size={30} />
                </div>
            </div>

            <div className="homepage-buttons">
                <button onClick={navigateToTrack}>Track Project</button>
                <button onClick={navigateToDesign}>Pattern Design</button>
                <button onClick={navigateToLibrary}>Find Pattern</button>
                <button onClick={navigateToInventory}>Manage Inventory</button>
            </div>
        </div>
    )
}

export default Homepage
