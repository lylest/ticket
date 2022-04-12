import React,{useState,useEffect} from 'react'
import {Icon,Button,Collapse, Tooltip,Position} from '@blueprintjs/core'
import {collection, onSnapshot, query,limit, where} from 'firebase/firestore'
import db  from '../firebase/config'

function Tickets(props) {
    const [isOpen,setIsOpen] =useState(false)
    const [allTickets,setAllTickets] = useState([])
    const [filter,setFilter] = useState("all")
    const [load,setLoad] = useState(100)
    const [empty,setEmpty] = useState(true)
    const [all,setAll] = useState(false)

    const openTicket = props.getTicket

   useEffect(()=>{
      
    const unSubscribe = async()=>{
        let quertRef = query(
                collection(db,"tickets"),
                limit(load)
        );
        await onSnapshot(quertRef,(snapshot)=>{
             let resArry = []
             snapshot.forEach(doc=>{
                 resArry.push({
                    assigned_to:doc.data().assigned_to,
                    channel:doc.data().channel,
                    created_at:doc.data().created_at,
                    description:doc.data().description,
                    id:doc.data().id,
                    replies:doc.data().replies,
                    requestor:doc.data().requestor,
                    requestorContact:doc.data().requestorContact,
                    status:doc.data().status,
                    subject:doc.data().subject,
                    ticket_number:doc.data().ticket_number,
                    docId:doc.id
                 })
             });
            setAllTickets(resArry);
             
        })
           
    }
    unSubscribe();
    return()=>unSubscribe()
   },[all])


      
    const filterFn = async(criteria)=>{
            if(criteria === "all"){
                setAllTickets([])
                    setAll(prev=>!prev);
                        setIsOpen(prev=>!prev)
                            setFilter(criteria)
            }   else {
                setAllTickets([]);
                setIsOpen(prev=>!prev)
                   setFilter(criteria)
           let quertRef = query(
                   collection(db,"tickets"),
                   where("status","==",criteria),
                   limit(load)
           );
           await onSnapshot(quertRef,(snapshot)=>{
                let resArry = []
                snapshot.forEach(doc=>{
                    resArry.push({
                       assigned_to:doc.data().assigned_to,
                       channel:doc.data().channel,
                       created_at:doc.data().created_at,
                       description:doc.data().description,
                       id:doc.data().id,
                       replies:doc.data().replies,
                       requestor:doc.data().requestor,
                       requestorContact:doc.data().requestorContact,
                       status:doc.data().status,
                       subject:doc.data().subject,
                       ticket_number:doc.data().ticket_number,
                       docId:doc.id
                    })
                });
               setAllTickets(resArry);
                
           })
            }        
    }


    const activateTab = ()=>{

      }
  return (
    <div className="tickets-wrapper">
        <div className="options-wrapper">
            <div className="title-wrapper">
                 <div className="title-inline">
                    <Icon icon="projects" color="#DDA706" size={20}  className="icon-ticket"/>
                         <h3>Tickets</h3>
                     </div>
                    <p>Total tickets: 24</p> 
            </div>

            <div className="title-wrapper" style={{ marginTop:10}}>
                 <div className="title-inline">
                    <Icon icon="exchange" color="#DDA706" size={20}  className="icon-ticket"/>
                         <h3>Channels</h3>
                     </div>
            </div>

             <div className="channel"> 
                    <Icon icon ="envelope" color="#03363d" className="channel-button"/>
                        <p>E-mail</p>
                        </div>
             <div className="channel"> 
                    <Icon icon ="form"  color="#03363d"className="channel-button"/>
                        <p>Web</p>
                        </div>
             <div className="channel"> 
                    <Icon icon ="mobile-phone" color="#03363d" className="channel-button"/>
                        <p>SMS</p>
                        </div>
             <div className="channel-button"> 
                    <Button icon ={isOpen ? "chevron-up" : "chevron-down" }className="channel-button"
                        onClick={() => setIsOpen(prev=>!prev)}>sort by:{filter}</Button>
                        <Collapse isOpen={isOpen} >
                            <div className="collapse-sort">
                            <div className="sort-bar">
                                <div className="sort-dot" style={{backgroundColor:'#444'}} />
                                    <button onClick={()=>filterFn("all")} className="">All</button>
                            </div>
                            <div className="sort-bar">
                                <div className="sort-dot" style={{backgroundColor:'#1fb069'}} />
                                    <button onClick={()=>filterFn('new')} className="">New</button>
                            </div>
                            
                            <div className="sort-bar">
                                <div className="sort-dot" style={{backgroundColor:'#afc7c7'}} />
                                    <button onClick={()=>filterFn('opened')} className="">Opened</button>
                            </div>

                            <div className="sort-bar">
                                <div className="sort-dot" style={{backgroundColor:'#03363d'}} />
                                    <button onClick={()=>filterFn('closed')} className="">Closed</button>
                            </div>

                            <div className="sort-bar">
                                <div className="sort-dot" style={{backgroundColor:'#3e8dae'}} />
                                    <button   onClick={()=>filterFn('resolved')} className="">Resolved</button>
                            </div>
                            </div>

                        </Collapse>
                     </div>
        </div>
    <div className="all-wrapper">
    <div className="labels">
             <div className="label-title-id">NO</div>
             <div className="label-title-subject">Subject</div>
             <div className="label-title-channel">Channel</div>
             <div className="label-title-req">Requestor</div>
             <div className="label-title-asgn">Assigned to</div>
             <div className="label-title-date">Date</div>
             <div className="label-title-status">Status</div>
         </div>


         {allTickets.length <=0  ?<div>
                <div className="label-item-Icon-center">
                     <Icon icon="projects" color="#DDA706"  className='icon-self' size={100}/>
                     <p>There is currently  no tickets</p>
                    </div>
         </div> :
                 <div className="main-label-items">
                     {
                       allTickets.map(ticket =>(
                        <div className="labels-items" onClick={() =>openTicket(ticket)}>
                        <Tooltip 
                           content={"ID"+ticket.id} position={Position.RIGHT} openOnTargetFocus={true}><div className="label-item-id">#{ticket.ticket_number}</div></Tooltip>
                        <div className="label-item-subject">
                            <div className="label-item-dot" style={{backgroundColor:
                            ticket.status === "new" ? '#1fb069':
                            ticket.status === "opened" ? '#afc7c7':
                            ticket.status === "closed" ? '#03363d':
                            ticket.status === "resolved" ? '#3e8dae':"#333"}} />
                            {ticket.subject}</div> 
                        <div className="label-item-channel">{ticket.channel}</div>
                        <div className="label-item-req">{ticket.requestor}</div>
                        <div className="label-item-asgn">{ticket.assigned_to}</div>
                        <div className="label-item-date">{ticket.created_at}</div>
                        <div className="label-item-status" style={{backgroundColor:
                            ticket.status === "new" ? '#1fb069':
                            ticket.status === "opened" ? '#afc7c7':
                            ticket.status === "closed" ? '#03363d':
                            ticket.status === "resolved" ? '#3e8dae':'#3333'}}>{ticket.status}</div>
                    </div>
                       ))
                     }
                     </div>}
    </div>

    </div>
  )
}

export default Tickets