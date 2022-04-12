import React,{useState,useEffect} from 'react'
import {Icon,Collapse,Dialog} from '@blueprintjs/core'
import Login from '../components/Login';
import config  from '../firebase/config';
import db  from '../firebase/config'
import {setDoc,doc,collection} from 'firebase/firestore'
import {getAuth, createUserWithEmailAndPassword} from 'firebase/auth'


const auth = getAuth()


function Auth() {
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


    const signUpFn = ()=>{
        setDisabled(true);
        createUserWithEmailAndPassword(auth,email, pwd)
        .then((userCredential) => {
          // Signed up successfully
           let user = userCredential.user;
           // save user credentials into database
           let default_user_img ='https://picsum.photos/id/237/200/300';
           
           let docRef = doc(collection(db,'users'))
             setDoc(docRef,{
                    id:user.reloadUserInfo.localId,
                    createdAt: user.reloadUserInfo.createdAt,
                    email:user.reloadUserInfo.email,
                    username:username,
                    photoURL:default_user_img,
                    role:'agent',
                    emailVerified:false

           });

           setDialog(true);
        
        }).catch((error) => {
           console.log(error.message)
           console.log(error.code)
           seterrorMessage(error.message);
           setErrorState(true);

        })
      }

    const validateName =(name) => {
       
        if(name.length <= 5){
            show_name(true);
            setUsername(name)
        } else {
            show_name(false)
            setUsername(name)
        }
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
             if(username.length > 5 && email.length > 7 && pwd.length > 7){
                  setDisabled(false);
                  console.log("helo")
             } else {
                 setDisabled(true);
             }
        
     },[username,email,pwd]);
  return (
    <div className="auth-container">
       <div className="auth-nav">
             <h2>Asyx <Icon icon="right-join" iconSize={25} color="#78a300"/></h2>
       </div>

            <div className="auth-wrapper">
                <div className="auth-sider">
                    <h1>Welcome Back!</h1> 
                        <p>To login in into your existing account, click the "login in" button </p>
                        <button onClick={() =>setDialog(prev=>!prev)}>LOGIN</button>
                </div>
                <div className="auth-section">
                    <h1> Create Account</h1> 

                    <div className="form-div">
                        <div className='left-icon'><Icon icon="user" color="#ccc" /></div>
                            <input type="text" placeholder="Name" 
                                onChange={(e)=>validateName(e.target.value)}
                                className='input'/>
                                <div className='left-icon'>
                                   {username.length <= 0  ? <div /> :  <Icon  color={hide_name ?  "#b41313" :"#1fb069"} icon={hide_name ? "cross" :"tick"}  />}</div>
                    </div>
                    <Collapse isOpen={hide_name} canOutsideClickCancel={false}>
                         <div className="pwd-check">
                             <p>Username is too short</p>
                         </div>
                     </Collapse>

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
                             onClick={() =>signUpFn()}
                            style={{backgroundColor:disabled ? "#999" : "#03363d",color:disabled ? "#666" :"#fff"}}>SIGN UP</button>
                            <Collapse isOpen={error_state} canOutsideClickCancel={false}>
                     <div className="pwd-check">
                        <p>{error_message}</p>
                    </div>
 </Collapse>
                </div>

                 <Dialog isOpen={dialog} canOutsideClickCancel={true} onClose={()=>setDialog(prev=>!prev)}>
                   <Login />
                 </Dialog>
            </div>
    </div>
  )
}

export default Auth