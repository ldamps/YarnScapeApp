import React from 'react'
import ReactDOM from 'react-dom/client'
//import App from './App'
import Homepage from './pages/Homepage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import AuthRoute from './AuthRoute'
import Userprofile from './pages/Userprofile'
import Settings from './pages/Settings'
import Privacypolicy from './pages/Privacypolicy'
import Termscon from './pages/TermsCon'
import Track from './pages/Track'
import Design from './pages/design'
import Library from './pages/Library'
import Inventory from './pages/Inventory'

//import './index.css'

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
        <Route path="/userprofile" element={<AuthRoute><Userprofile /></AuthRoute>} />
        <Route path="/settings" element={<AuthRoute><Settings /></AuthRoute>} />
        <Route path="/privacypolicy" element={<AuthRoute><Privacypolicy /></AuthRoute>} />
        <Route path="/termsconditions" element={<AuthRoute><Termscon /></AuthRoute>} />
        <Route path="/track" element={<AuthRoute><Track /></AuthRoute>} />
        <Route path="/design" element={<AuthRoute><Design /></AuthRoute>} />
        <Route path="/library" element={<AuthRoute><Library /></AuthRoute>} />
        <Route path="/inventory" element={<AuthRoute><Inventory /></AuthRoute>} />
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
