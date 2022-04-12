import React,{useState,useEffect} from 'react'
import default_img from '../img/default.jpg'
import {Icon,Button,Alert} from '@blueprintjs/core'

import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth} from "firebase/auth";
import {collection,doc, setDoc,query,limit,onSnapshot,updateDoc,where} from 'firebase/firestore'
import db  from '../firebase/config'
const uniqueId = require('react-unique-nums')


const auth = getAuth()

function OpenTicket(props) {

  const [user] = useAuthState(auth)
  const [isOpen,setIsOpen] =useState(false)
  const default_user_img ='https://picsum.photos/id/237/200/300';
  const { assigned_to,docId,channel,created_at,description,id,replies,requestor,requestorContact,status,subject,ticket_number} = props.info
  const [reply,setReply] = useState("")
  const [disabled,setDisabled] = useState(true)
  const [show,hide] = useState(false)
  const [allReplies,setAllReplies] = useState([])
  const [intial,setInitial] = useState(50)
  const [isClosed,setIsClosed] = useState(false)
  const [isResolved,setIsResolved] = useState(false)
  const [db_ticket_status,setDbTicketStatus] = useState('#fff');

  const sendReplyFn = async()=>{

        let docRef = doc(collection(db,"replies"));
        let reply_id = uniqueId()
        let time_stamp = new Date().toString()

        await  setDoc(docRef,{
             id: reply_id,
             reply:reply,
             replied_by_id:user.uid,
             replied_by_email:user.email,
             time_stamp:time_stamp,
             ticket_id:id
        })
        await hide(prev=>!prev)
  }

  useEffect(() =>{
    if(reply.length <= 0){setDisabled(true)} else setDisabled(false);
  },[reply])

  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'replies'),limit(intial),where("ticket_id","==",id));
       await onSnapshot(queryRef,(snapshot) =>{
         let repliesArry = []
         snapshot.forEach(doc =>{
            repliesArry.push({
               id: doc.data().id,
              replied_by_email:doc.data().replied_by_email,
              replied_by_id:doc.data().replied_by_id,
              reply:doc.data().reply,
              ticket_id:doc.data().ticket_id,
              time_stamp:doc.data().time_stamp,
  
            })
         });
         setAllReplies(repliesArry);

       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);

  useEffect(() =>{
       const statusListner =async()=>{
             let queryRef = query(
               collection(db,"tickets"),
               where("id","==",id),
               limit(1))

              await onSnapshot(queryRef,(snapshot)=>{
                 let doc_status;
                  snapshot.forEach(doc=>{
                      doc_status = doc.data().status;
                  })
                  setDbTicketStatus(doc_status)
              })


       }
       statusListner();
       return ()=>statusListner();
  },[])


  const closeTicketFn =async()=>{
         let docRef = doc(db,"tickets",docId);
         await updateDoc(docRef,{
              status:"closed"
         })
         await setIsClosed(prev=>!prev);
        
         
        let createNotificationRef = doc(collection(db,'notifications'))
        let noti_id = uniqueId();
        let noti_time_stamp = new Date().toString();

        await setDoc(createNotificationRef,{
               id:noti_id,
               time_stamp:noti_time_stamp,
               action:"Ticket number #"+ticket_number+ " closed",
               read:false,
               icon:'delete',
               color:'#03363d',
               owner:user.email
        });
    }

  const resolveTicketFn =async()=>{
       let docRef = doc(db,"tickets",docId);
       await updateDoc(docRef,{
            status:"resolved"
       }); 
       await setIsResolved(prev=>!prev);
       let createNotificationRef = doc(collection(db,'notifications'))
       let noti_id = uniqueId();
       let noti_time_stamp = new Date().toString();

       await setDoc(createNotificationRef,{
              id:noti_id,
              time_stamp:noti_time_stamp,
              action:"Ticket number #"+ticket_number+ " resolved",
              read:false,
              icon:'confirm',
              color:'#3e8dae',
              owner:user.email,

       });
  }
  return (
    <div className="main-ticket-container">
        <div className="ticket-container-sider">
           <p className='ticket-container-p'>Requestor</p>
           <div className="agent-bar" style={{backgroundColor: '#fff',width: '98%'}}>
                    <img src={default_img} alt='agent_img' />
                      <p>{requestor}</p>

                </div>

                <p className='ticket-container-p'>Assigned to</p>
                <div className="agent-bar" style={{backgroundColor: '#fff',width: '98%'}}>
                    <img src={default_user_img} alt='agent_img' />
                      <p>{assigned_to}</p>
                        
                </div>

                <p className='ticket-container-p'>Channel</p>
                <button className='channel-li'>{channel}</button>
                <p style={{marginLeft:25,marginTop:5}}>{requestorContact}</p>

                <p className='ticket-container-p'>Description</p>
                <div className="agent-bar" style={{backgroundColor: '#fff',width: '98%'}}>
                  <p style={{marginLeft:25}}>{description}</p> 
                  </div>
        </div>

        <div className="ticket-container-section">
          <h2>{subject}<button style={{backgroundColor:
                            db_ticket_status === "new" ? '#1fb069':
                            db_ticket_status === "opened" ? '#afc7c7':
                            db_ticket_status === "closed" ? '#03363d':
                            db_ticket_status === "resolved" ? '#3e8dae':"#333"}} className="btn-new">{db_ticket_status}</button></h2>
          <p style={{marginTop:-12}}>From requester {requestor} sent via {channel} using {requestorContact}</p>

           <p className="section-p-replies">Reply</p>
              <div className="section-replies-box">
                  <textarea className="reply-box" 
                     onChange={(e)=>setReply(e.target.value)}
                     placeholder="write new reply"></textarea>
                   <button className='post-reply'
                      disabled={disabled}
                      onClick={()=>sendReplyFn()}
                       style={{backgroundColor: disabled ? "#f9f9f9": "#ddd"}}
                       >Post</button>
              </div>

              <p className='ticket-container-p' style={{paddingLeft:0}}>Recent replies</p>
                {allReplies.length <=0 ?
                 <div>
                     <Icon  style={{textAlign: 'center',marginLeft:'50%'}}icon='chat' color="#999" size={40}></Icon>
                     <p style={{textAlign: 'center',fontSize:17}}>There are no replies yet</p>
                </div> :
                    <div>
                      {allReplies.map(reply=>(
                                        <div className='single-reply-box'>
                                        <div className="agent-bar" style={{backgroundColor: '#fff',width: '98%'}}>
                                            <img src={default_user_img} alt='agent_img' />
                                              <div>
                                                <h3>{reply.replied_by_email}</h3>
                                                  <p style={{fontSize: 10,marginTop:-30}}>{reply.time_stamp}</p>
                                              </div>
                                        </div>
                                        <p style={{marginLeft:50}}>{reply.reply}</p>  
                                          </div>
                      ))}
                      </div>}

                 <div className="action-btn-reply">
                   <button 
                    onClick={() =>closeTicketFn()}
                    type="button" style={{backgroundColor:'#03363d'}}>close ticket</button>

                   <button 
                   onClick={() =>resolveTicketFn()}
                   type="button" style={{backgroundColor:'#3e8dae'}}>submit as resolved</button>
                 </div>
          </div>

          <Alert isOpen={show} canOutsideClickCancel={true} onClose={()=>hide(prev=>!prev)}>
              Reply sent successfully
          </Alert>

          <Alert isOpen={isClosed} canOutsideClickCancel={true} onClose={()=>setIsClosed(prev=>!prev)}>
              Tickets No: {ticket_number} was successfully closed
          </Alert>

          
          <Alert isOpen={isResolved} canOutsideClickCancel={true} onClose={()=>setIsResolved(prev=>!prev)}>
              Tickets No: {ticket_number} was marked  Resolved
          </Alert>
    </div> 
  )
}

export default OpenTicket