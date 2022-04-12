import React from 'react'
import  TopNavBar from '../components/TopNavBar'
import AllStats from '../components/AllStats'

function Stats() {
  return (
    <div>
        <TopNavBar title={"STATISTICS"} />
            <AllStats  />
    </div>
  )
}

export default Stats