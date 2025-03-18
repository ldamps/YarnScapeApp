// For the Login screen
import { useState, useEffect } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import './styles.css'

const Login = () => {
    // Initialize Firebase authentication and navigation
    const auth = getAuth();
    const navigate = useNavigate();
    
    // State variables for managing authentication state, email, password, and error messages
    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // Function to handle sign-in with email and password
    const signInWithEmail = async () => {
        setAuthing(true);
        setError('');

        // Use Firebase to sign in with email and password
        signInWithEmailAndPassword(auth, email, password)
            .then(response => {
                console.log(response.user.uid);
                navigate('/');
            })
            .catch(error => {
                console.log(error);
                setError(error.message);
                setAuthing(false);
            });
    }

    return (
        <div className='signin-container'>
            <div className='login-section'>

                {/* Header section */}
                <div className='login-section-header'>
                    <h3>Welcome to YarnScape: </h3>
                </div>

                <div className='login-section-input'>
                    <input
                        type='email'
                        placeholder='Email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)} />

                    <input
                        type='password'
                        placeholder='Password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                </div>

                <div className='login-section-submitbtn'>
                    <button
                        onClick={signInWithEmail}
                        disabled={authing}>
                        Login
                    </button>
                </div>

                {/* Display error message (if one) */}
                {error && <div className='signin-error-message'>{error}</div>}
                
            </div>

            <div className='yes-no-account1'>
                <p>Don't have an account? <span><a href='/signup'>Sign Up</a></span></p>
            </div>
        </div>
    );
}

export default Login;