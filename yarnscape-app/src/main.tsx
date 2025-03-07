import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthRoute from './AuthRoute'
import './index.css'

import {
  BrowserRouter as Router, Routes, Route, Navigate
} from 'react-router-dom'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyANPim1rz1Q-1Kg6PdOO8QrsIAnNA_twqg",
  authDomain: "yarnscape-7fa2d.firebaseapp.com",
  projectId: "yarnscape-7fa2d",
  storageBucket: "yarnscape-7fa2d.firebasestorage.app",
  messagingSenderId: "869358734820",
  appId: "1:869358734820:web:aaa82ec58ebe7325bd0bf1"
};
// Initialize Firebase
const app = initializeApp(firebaseConfig);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<AuthRoute><Homepage /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  </React.StrictMode>,
)


/*import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)*/
