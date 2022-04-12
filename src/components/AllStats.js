import React,{useState,useEffect} from 'react'
import {Icon} from '@blueprintjs/core'
import {collection,doc, setDoc,query,limit,onSnapshot,updateDoc,where} from 'firebase/firestore'
import db  from '../firebase/config'

function AllStats() {
    const [all, setAll] = useState(0);
    const [newTickets, setNewTickets] = useState(0);
    const [opened, setOpened] = useState(0);
    const [closed, setClosed] = useState(0);
    const [resolved, setResolved] = useState(0);

    
  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'tickets'),where("status","==","new"));
       await onSnapshot(queryRef,(snapshot) =>{
                setNewTickets(snapshot.size)
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);

  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'tickets'),where("status","==","resolved"));
       await onSnapshot(queryRef,(snapshot) =>{
                setResolved(snapshot.size)
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);


  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'tickets'),where("status","==","opened"));
       await onSnapshot(queryRef,(snapshot) =>{
                setOpened(snapshot.size)
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);


  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'tickets'),where("status","==","closed"));
       await onSnapshot(queryRef,(snapshot) =>{
                setClosed(snapshot.size)
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);

  useEffect(() =>{

    const unSubscribe = async() =>{
       let queryRef = query(collection(db,'tickets'));
       await onSnapshot(queryRef,(snapshot) =>{
                setAll(snapshot.size)
       })
    }
    unSubscribe();
    return ()=>unSubscribe();
  },[]);
  return (
    <div className="stats-wrapper">
         <div className="box-wrapper">
             <div className="box-one">
                 <div className="all-stat-box">
                     <p>{all}</p>
                        <h3>Total Tickets </h3>
                        <div className='sider-div' style={{marginTop:80}}><Icon icon="right-join" iconSize={40} color="#ccc"/></div>
                 </div>
                 <div className="all-stat-box-img">
                     <h3>Channels </h3>
                     <p>SMS</p>
                     <p>E-mail</p>
                     <p>Web-form</p>
                 </div>
             </div>
             <div className="box-two">

                 <div className="sub-box1">
                     <p>{newTickets}</p>
                     <h3>New tickets</h3>
                 </div>

                 <div className="sub-box2">
                     <p>{opened}</p>
                     <h3>Open tickets</h3>
                 </div>


                 <div className="sub-box3">
                     <p>{resolved}</p>
                     <h3>Resolved tickets</h3>
                 </div>

                 <div className="sub-box4">
                     <p>{closed}</p>
                     <h3>Closed tickets</h3>
                 </div>


             </div>
         </div>
    </div>
  )
}

export default AllStats