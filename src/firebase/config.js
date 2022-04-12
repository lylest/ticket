import {initializeApp}  from 'firebase/app'
import {getFirestore} from 'firebase/firestore'
require('dotenv/config');



const config = {
  apiKey:process.env.REACT_APP_API_KEY ,
  authDomain:process.env.REACT_APP_AUTH_DOMAIN ,
  projectId:process.env.REACT_APP_PROJECT_ID ,
  storageBucket:process.env.REACT_APP_STORAGE_BUCKET ,
  messagingSenderId:process.env.REACT_APP_MESSAGE_ID ,
  appId:process.env.REACT_APP_APP_ID ,
  measurementId:process.env.REACT_APP_MEASUREMENT_ID
  };



   const db =  initializeApp(config);

    export default getFirestore()

