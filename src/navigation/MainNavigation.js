import React from 'react'
import Home from '../screen/Home.js'
import Auth from '../screen/Auth'
import Stats from '../screen/Stats'
import Results from '../screen/Results'
import {BrowserRouter as Router, Routes,Route} from 'react-router-dom'

function MainNavigation() {
  return (
  
      
         <Routes>
              <Route path="/"  element={<Home />} />
               <Route path="/Home"  element={<Home />} />
               <Route path="/Authentication" element={<Auth />} />
               <Route path="/Statistics"  element={<Stats />} />
               <Route path="/Results"  element={<Results />} />
  
         </Routes>
        
 
  )
}

export default MainNavigation