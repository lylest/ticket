import React,{useState,useEffect} from 'react'
import {Icon,Collapse} from '@blueprintjs/core'
import config  from '../firebase/config';
import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'
import { useAuthState } from 'react-firebase-hooks/auth';
import {useNavigate} from 'react-router-dom'
const uniqueId = require('react-unique-nums')


const auth = getAuth()


function Auth() {

    const [currentUser] = useAuthState(auth)
    let navigate = useNavigate()

    const [isOpen,setIsOpen] =useState(false)
    const [hide,show] =useState(false)
    const [hide_name,show_name] =useState(false)
    const [disabled,setDisabled] =useState(true)
    const [dialog,setDialog] = useState(false)
    const [email,setEmail] = useState("")
    const [pwd,setPwd] = useState("")
    const [username,setUsername] = useState("")
    const [alert,setAlert] = useState(false);
    const [error_state, setErrorState] = useState(false)
    const [error_message,seterrorMessage] = useState("")


    const LoginFn = ()=>{
        setDisabled(true);
        signInWithEmailAndPassword(auth,email, pwd)
        .then((userCredential) => {
          // Signed up successfully
           let user = userCredential.user;
           
           //send user home
            return navigate('./Home');
        
        }).catch((error) => {
           console.log(error.message);
            seterrorMessage(error.message);
            setErrorState(true);
           console.log(error.code)

        })
      }

   
    const validateEmail = (email) => {
        var validRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        if(!email.match(validRegex)){
            show(true);
            setEmail(email)
        } else {
            show(false)
            setEmail(email)
        }
    }

    const validatePwd=(pwd) => {
        if(pwd.length <= 7){
            setIsOpen(true);
            setPwd(pwd)
        } else {
            setIsOpen(false);
            setPwd(pwd)
        }
    }

     useEffect(() =>{
        // console.log('listening')
             if( email.length > 7 && pwd.length > 7){
                  setDisabled(false);
                  console.log("helo")
             } else {
                 setDisabled(true);
             }
        
     },[email,pwd]);
  return (
      <div >
            <h1 style={{textAlign: 'center'}}> Login</h1> 

            <div className="form-div">
                <div className='left-icon'><Icon icon="envelope" color="#ccc" /></div>
                    <input type="text" placeholder="E-mail" 
                    onChange={(e)=>validateEmail(e.target.value)}
                    className='input'/>
                        <div className='left-icon'>
                        {email.length <= 0  ? <div /> :  <Icon  color={hide ?  "#b41313" :"#1fb069"} icon={hide ? "cross" :"tick"}  />}</div>
            </div>

                <Collapse isOpen={hide} canOutsideClickCancel={false}>
                    <div className="pwd-check">
                         <p>Incorrect E-mail </p>
                    </div>
                </Collapse>


                <div className="form-div">
                        <div className='left-icon'><Icon icon="lock" color="#ccc" /></div>
                            <input type="password" placeholder="Password" 
                            onChange={(e)=>validatePwd(e.target.value)}
                            className='input'/>
                                <div className='left-icon'>
                                {pwd.length <= 0  ? <div /> :  <Icon  color={isOpen ?  "#b41313" :"#1fb069"} icon={isOpen ? "cross" :"tick"}  />}</div>
                    </div>
                    <Collapse isOpen={isOpen} canOutsideClickCancel={false}>
                        <div className="pwd-check">
                            <p>Password length is too short.</p>
                        </div>
                    </Collapse>
       
                    <button className='signup' 
                            disabled={disabled}
                            onClick={() =>LoginFn()}
                            style={{backgroundColor:disabled ? "#999" : "#03363d",color:disabled ? "#666" :"#fff"}}>LOGIN</button>

                    <Collapse isOpen={error_state} canOutsideClickCancel={false}>
                        <div className="pwd-check">
                            <p>{error_message}</p>
                        </div>
                    </Collapse>
                    </div>
                    )
                }

export default Auth