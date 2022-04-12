import React from 'react'
import TopNavBar from '../components/TopNavBar'
import { useLocation} from 'react-router-dom'
import OpenTicket from '../components/OpenTicket'

function Results() {
    const{state} = useLocation()  
  return (
    <div className="result-wrapper">
        <TopNavBar />
            <div className='res-ticket-wrapper'>
                <OpenTicket info={state} />
            </div>
    </div>
      )
}

export default Results