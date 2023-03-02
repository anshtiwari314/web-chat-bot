import React from 'react'
import {useAuth} from './AuthProvider'
import Cookies from "js-cookie";

export default function Dashboard() {

  const {setCurrentUser} = useAuth()

  console.log('i am dashboard')

  return (
    <>    
        <h1>Welocome u are logged in</h1>
        <button onClick={()=>{Cookies.set('sessionid',-1); setCurrentUser(false)} }>Logged out</button>
    </>

  )
}
