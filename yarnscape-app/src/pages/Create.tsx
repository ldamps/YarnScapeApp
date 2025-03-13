// For the Pattern Create screen
import { useNavigate } from "react-router-dom";
import {FaArrowCircleLeft} from 'react-icons/fa';
import './styles.css'


const Create = () => {
    const navigate = useNavigate();
    const handleGoBack = () => {
        navigate(-1);
    }


    return (
        <div className="create-container">
            <div className="settings-header">
                <div className="back-icon" onClick={handleGoBack}>
                    <FaArrowCircleLeft size={30} />
                </div>
            </div>
        </div>
    )
}

export default Create