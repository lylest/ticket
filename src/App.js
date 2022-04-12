import React from 'react';
import './css/main.css';
import MainNavigation  from './navigation/MainNavigation';
import Auth from './screen/Auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import {getAuth} from 'firebase/auth'
import {BrowserRouter as Router} from 'react-router-dom'


const auth = getAuth()

function App() {
  const [user] = useAuthState(auth)

  return (
    <Router>
        {user === null ? <Auth /> : <MainNavigation />}
    </Router>
      
  )
}

export default App