import React,{useState} from 'react'
import {Icon,Collapse} from '@blueprintjs/core';

import { useAuthState } from 'react-firebase-hooks/auth';
import { getAuth} from "firebase/auth";
import {collection,doc,deleteDoc,updateDoc} from 'firebase/firestore'

import db  from '../firebase/config'

function NotiBar(props) {
    const [more,setMore] = useState(false); 
    const {icon,action,docId} = props.noti_info


    const marked_as_read = async()=>{
        let docRef = doc(db,"notifications",docId);
        await updateDoc(docRef,{
             read:true
        })
    }

    const delete_noti = async()=>{
        let docRef = doc(db,"notifications",docId);
        await deleteDoc(docRef);
    }
  return (
    <div>
        <div className="agent-bar" style={{width: '98%'}}>
            <Icon icon={icon}  className="noti-icon"/>
                <p>{action}</p>
                <button type="button" onClick={()=>setMore(prev=>!prev)} className='more'><Icon  icon="more" /></button>
            </div> 

        <Collapse isOpen={more} onClose={()=>setMore(prev=>!prev)} canOutsideClickCancel={true}>
            <div className='more-opt'>
                <button onClick={() =>marked_as_read()}>mark as read</button>
                <button onClick={() =>delete_noti()}>clear</button>
        </div>
        </Collapse>
    </div>
  )
}

export default NotiBar