import Cookies from 'js-cookie'
import React,{useState} from 'react'
import {useAuth} from './AuthProvider'


export default function LoginScreen() {
    let username = 'Anshtiwari314@gmail.com'
    let password = 'anuj@123'

    const {setCurrentUser} = useAuth()
    const [user,setUser] = useState('')
    const [pass,setPass] = useState('')

    function handleLogin(){
        if(user === username && password === pass){
          Cookies.set('sessionid',"e03f3024-71f8-11ed-bf5b-0a58a9feac02")
          
          setCurrentUser(true)

        }
    }

  return (
    <>    <div style={{height:"90vh",width:"95vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
        <div style={{textAlign:"center"}}>
        <div ><input type="text" value={user} onChange={(e)=> setUser(e.target.value) }/></div>
        <div><input type="password" value={pass} onChange={(e)=>setPass(e.target.value)}/></div>
        <button onClick={()=>handleLogin()}>Login</button>
        </div>
    </div>
    
    </>

  )
}

