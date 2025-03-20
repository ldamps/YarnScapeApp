
import React from 'react'
import ReactDOM from 'react-dom/client'
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
import Library from './pages/library'
import Inventory from './pages/inventory'
import Create from './pages/Create'
import Tracking from './pages/Tracking'
import EditMyPattern from './pages/Edit'
import Publish from './pages/Publish'
import Pattern from './pages/Pattern'

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

const App = () => {
    return (
        <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<AuthRoute><Homepage /></AuthRoute>} />
        <Route path="/userprofile" element={<AuthRoute><Userprofile /></AuthRoute>} />
        <Route path="/settings" element={<AuthRoute><Settings /></AuthRoute>} />
        <Route path="/privacypolicy" element={<AuthRoute><Privacypolicy /></AuthRoute>} />
        <Route path="/termsconditions" element={<Termscon />} />
        <Route path="/track" element={<AuthRoute><Track /></AuthRoute>} />
        <Route path="/design" element={<AuthRoute><Design /></AuthRoute>} />
        <Route path="/library" element={<AuthRoute><Library /></AuthRoute>} />
        <Route path="/inventory" element={<AuthRoute><Inventory /></AuthRoute>} />
        <Route path="/create" element={<AuthRoute><Create /></AuthRoute>} />
        <Route path="/tracking/:projectId" element={<AuthRoute><Tracking /></AuthRoute>} />
        <Route path="/edit/:patternId" element={<AuthRoute><EditMyPattern /></AuthRoute>} />
        <Route path="/publish/:patternId" element={<AuthRoute><Publish /></AuthRoute>} />
        <Route path="/pattern/:patternId" element={<AuthRoute><Pattern /></AuthRoute>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
    )
}

export default App;