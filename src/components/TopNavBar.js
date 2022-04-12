import React,{useState,useEffect} from 'react'
import {Icon, Dialog, Collapse,Popover,Menu,Position, MenuItem,Alert} from '@blueprintjs/core'
import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth,signOut} from "firebase/auth";
import {collection,doc, setDoc, query, where, onSnapshot} from 'firebase/firestore'
import db  from '../firebase/config'
import {Link,useNavigate} from 'react-router-dom'
import NotiBar from './NotiBar';
const uniqueId = require('react-unique-nums')


const auth = getAuth()

function TopNavBar(props) {

  const [user] = useAuthState(auth)
  const [show,hide] = useState(false)
  const [isOpen,setIsOpen]=  useState(false)
  const [isMe,setIsMe] = useState(false)
  const [more,setMore] = useState(false)
  const [requestor,setRequestor] = useState("")
  const [requestorContact,setRequestorContact] = useState("")
  const [subject,setSubject] = useState("")
  const [description,setDescription] = useState("")
  const [channel,setChannel] = useState("SMS")
  const [showAlert,setShowAlert] = useState(false)
  const [disabled,setDisabled] = useState(true)
  const [allNotifications,setAllNotifications] = useState([])
  const [newNotiStatus,setNewNotiStatus] = useState(false)
  const [term,setTerm] = useState("");
  const [empty,setEmpty] = useState(false)
  let default_user_img ='https://picsum.photos/id/237/200/300';
  let navigate = useNavigate()

  const {title} = props


  const callbackFn =()=>{
       setIsOpen(prev=>!prev)
  }

  const searchFn =async()=>{
    
    let number_term = Number(term)
    let quertRef = query(
      collection(db,"tickets"),
      where("ticket_number","==",number_term),
      );

    await onSnapshot(quertRef,(snapshot)=>{
         if(snapshot.empty){
           setEmpty(prev=>!prev);
         } else {
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
         // console.log(resArry,'from topnav')
          navigate('/Results/',{state:resArry[0]})

         }
   
      
 })
      
  }
  const logout = async()=>{
       try {
        await signOut(auth);
        await  navigate('./Authentication');
       } catch (error) {
          console.log(error.message,'failed to sign out')
       }
  }

  const createTicket = async()=>{
        setDisabled(true);
        let ticket_id = uniqueId()
        let time_stamp = new Date();
        let date_month_yr = time_stamp.getDate()+'/ '+ time_stamp.getMonth()+'/'+ time_stamp.getFullYear();
        let ticket_number = Math.floor(Math.random()*100000) + 1;

        let docRef = doc(collection(db,'tickets'))
        await setDoc(docRef,{
             id: ticket_id,
             ticket_number:ticket_number,
             created_at:date_month_yr,
             requestorContact:requestorContact,
             requestor:requestor,
             subject:subject,
             description:description,
             channel:channel,
             assigned_to:user.email, 
             status: 'new'
        })
        await setShowAlert(prev=>!prev);
          await hide(prev=>!prev)
              await setRequestorContact(""); setRequestor(""); setSubject(""); setDescription("");setChannel(""); 


        let createNotificationRef = doc(collection(db,'notifications'))
        let noti_id = uniqueId();
        let noti_time_stamp = new Date().toString()
      

        await setDoc(createNotificationRef,{
               id:noti_id,
               time_stamp:noti_time_stamp,
               action:"New ticket created with ticket number #"+ticket_number+' for the requestor contact '+requestorContact,
               read:false,
               icon:'projects',
               color:'#DDA706',
               owner:user.email,
         });

  }

  
  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'notifications'),where("read","==",false));
       await onSnapshot(queryRef,(snapshot) =>{
               if(snapshot.size <= 0){ setNewNotiStatus(false)} else setNewNotiStatus(true);
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);
  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'notifications'),where("owner","==",user.email));
       await onSnapshot(queryRef,(snapshot) =>{
         let notificationsArry = []
         snapshot.forEach(doc =>{
            notificationsArry.push({
              id:doc.data().id,
              time_stamp:doc.data().time_stamp,
              action:doc.data().action,
              read:doc.data().read,
              icon:doc.data().icon,
              owner:doc.data().owner,
              docId:doc.id
            })
         });
         setAllNotifications(notificationsArry)

       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);

  useEffect(()=>{
       if(requestor === "" || requestorContact === "" || subject === "" || description === "" || channel === ""){
          setDisabled(true)
         // console.log(requestor,requestorContact,subject,channel,description)
       } else {
         setDisabled(false)
       }
  },[requestor,requestorContact,subject,description,channel])



  return (
      <div className="main-wrapper">
          <div className="sider">
          <div className='sider-div'><Icon icon="right-join" iconSize={25} color="#FFCB2B"/></div>
              <div className="divider"/>
            <Link to={'/Home'}><div className='sider-div'><Icon icon="projects" iconSize={18} color={title=== "DASHBOARD" ? "#fff": "#999"}/></div></Link>
            <Link to={'/Statistics'}><div className='sider-div'><Icon icon="chart" iconSize={18} color={title=== "STATISTICS" ? "#fff": "#999"}/></div></Link>
          </div>
          <div className="nav-bar">
      <h3>{title}</h3>
    
      <input className="search-input" placeholder="Search tickets " 
          onChange={(e)=>setTerm(e.target.value)}
          type="text" />
      <div className="action-icons">
      <button className='icon-button'
            onClick={() =>searchFn()}
                ><Icon icon="search" iconSize={20} color="#666"/></button>
          <button className='icon-button'
            onClick={() =>hide(prev=>!prev)}
                ><Icon icon="add" iconSize={20} color="#666"/></button>

          <Popover content=
              {
                 <div>
                       <p className='ticket-container-p'>Notifications</p>

                      <div className="noti-bar"  >
                        {allNotifications.length <= 0 ? <p style={{textAlign: 'center'}}>No, new notifications</p>:
                            <div>
                               {allNotifications.map(noti=>(
                                 <div style={{backgroundColor: noti.read ? "inherit":'#f2f2f2'}}  className="noti-bar-line">
                                     <NotiBar noti_info ={noti}/>
                                </div>
                               ))}
                            </div>
                            }
                      </div>

                 </div>
            
                } position={Position.BOTTOM_BOTTOM}>
                <button className='icon-button'><Icon icon="notifications" iconSize={20} color={"#666"}/></button>
        </Popover>
         
          <Popover content=
              {
                 <Menu>
                     <p className='ticket-container-p'>Account</p>
                    
                    <MenuItem  label='Log out'  icon='log-out' onClick={()=>logout()}/>
                 </Menu>
            
                } position={Position.BOTTOM_BOTTOM}>
                <img  src={default_user_img} alt="profile-image"/>
        </Popover>
      </div>
      


   </div>
   <Dialog className="dialog" isOpen={show} onClose={()=>hide(prev=>!prev)} canOutsideClickCancel={true}>
             <h2>Create new ticket</h2>
             <input type="text" placeholder="Requester contact"
              onChange={(e)=>setRequestorContact(e.target.value)}
              className="form-control-input" />

             <input type="text" placeholder="Requester name" 
              onChange={(e)=>setRequestor(e.target.value)}
              className="form-control-input-agent" /> 
            
            <input type="text" placeholder="Subject" 
              onChange={(e)=>setSubject(e.target.value)}
              className="form-control-input" />
            <textarea type="text" placeholder="Description" 
              onChange={(e)=>setDescription(e.target.value)}
              className="form-control-textarea" />

            <p>Channel &emsp; </p>
            <select className="form-select" onChange={(e)=>setChannel(e.target.value)}>
              <option value="SMS">SMS</option>
              <option value="WEB-FORM">Web form</option>
              <option value="E-MAIL">E-mail</option>
            </select>

            <button 
              disabled={disabled}
              style={{backgroundColor: disabled ? '#999':'#03363d',color:disabled ? '#666':'#fff' }}
              className="create-ticket" onClick={()=>createTicket()}>Create</button>
         </Dialog>

         <Alert isOpen={showAlert} canOutsideClickCancel={true} onClose={()=>setShowAlert(prev=>!prev)}>
           Ticket successfully created
         </Alert>

         <Alert isOpen={empty} canOutsideClickCancel={true} onClose={()=>setEmpty(prev=>!prev)}>
           No ticket found matching ticket number
         </Alert>
      </div>
  )
}

export default TopNavBar