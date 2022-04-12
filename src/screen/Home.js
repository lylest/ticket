import React,{useState} from 'react'
import TopNavBar from '../components/TopNavBar'
import Tickets from '../components/Tickets'
import OpenTicket from '../components/OpenTicket'
import { Tab, Tabs, Button } from '@blueprintjs/core'
import {doc,updateDoc} from 'firebase/firestore'
import db  from '../firebase/config'

function Home() {
  const [selectedTabId,setSelectedTab] = useState("1")
  const [ticketInfo,seTicketInfo] = useState([])
  const [active_ticket,setActiveTicket] = useState("")
  const [tabs,setTabs] = useState([
         {id:"1",title:"OVERVIEW"},{id:"2",title:"unset"}
          ])

  const handleTabChange =(id)=>{
    setSelectedTab(id)
  }
  const openTicket =async(ticket)=>{
      seTicketInfo(ticket);
        setSelectedTab("2")
          setActiveTicket(ticket.ticket_number);

          let docId = ticket.docId
          let docRef = doc(db,"tickets",docId);
          await updateDoc(docRef,{
               status:"opened"
          })
         
  }

  
  return (
    <div>
        <TopNavBar title={"DASHBOARD"}/>
      
        <Tabs className="Tabs2Example" onChange={(id)=>handleTabChange(id)}  animate={true} selectedTabId={selectedTabId} >
        {tabs.map(tab=>(
                 <Tab id={tab.id} title={tab.title === 'OVERVIEW' ? "OVERVIEW": tab.title === 'unset' ? 'Ticket No#:'+active_ticket :active_ticket} style={{color: "#333",outline: "none"}} panel={tab.id === "1" ? <Tickets  getTicket ={openTicket}/> :
                                  ticketInfo.length <= 0 ? <div /> : <OpenTicket info={ticketInfo} />}  />
                ))}
           
        </Tabs>
  
    </div>
  )
}

export default Home