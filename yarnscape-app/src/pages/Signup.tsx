// For the signup screen

import { useState } from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup, createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './styles.css'
import { validatePasswordStrength } from '../components/validatePassword';

const Signup = () => {
    // Initialize Firebase authentication and navigation
    const auth = getAuth();
    const navigate = useNavigate();
    
    // State variables for managing authentication state, email, password, confirm password, and error messages
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isChecked, setIsChecked] = useState(false);

    const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setIsChecked(e.target.checked);
    };

    // Function to handle sign-up with email and password
    const validationError = validatePasswordStrength(password);
    const signUpWithEmail = async () => {

        // validating the password
        if (validationError) {
            setError(validationError); // checks that the password consists of uppercase, lowercase, a symbol, a number and is atleast length 8
            return;
        } else if (password !== confirmPassword) { // checks that the password and confirm password are the same
            setError('Passwords do not match');
            return;
        } else if (!isChecked) { // checks that the user has agreed to the terms and conditiions of YarnScape
            setError('Please agree to the terms and conditions in order to create your YarnScape account.');
            return;
        }

        setAuthing(true);
        setError('');

        // Use Firebase to create a new user with email and password
        createUserWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    };

    // To navigate to the login page
    const goLogin = () => {
        navigate('/login')
    }

    return (
        <div className='signin-container'>
            <div className='login-section'>

                {/*Header section */}
                <div className='login-section-header'>
                    <h3> Create an Account: </h3>
                </div>

                <div className='login-section-input'>
                    <input type='email' placeholder='Email' value={email} onChange={(e) => setEmail(e.target.value)} />

                    <input type='password' placeholder='Password' value={password} onChange={(e) => setPassword(e.target.value)} />

                    <input type='password' placeholder='Re-Enter Password' value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />

                    
                </div>

                <div className="termsCheckbox">
                    <label>
                        <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                        I agree to the <a href='/termsconditions'>Terms and Conditions</a>
                    </label>
                </div>


                <div className='login-section-submitbtn'>
                    <button onClick={signUpWithEmail} disabled={authing}>Create
                    </button>
                </div>

                 {/* Display error message (if one) */}
                {error && <div className='signin-error-message'>{error}</div>}

            </div>

            <div className='yes-no-account'>
                <p>Have an account? <span onClick={goLogin}>Login</span></p>
            </div>
        </div>
    );
}

export default Signup;