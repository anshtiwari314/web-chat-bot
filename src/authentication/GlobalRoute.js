import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {useAuth}  from './AuthProvider'

export default function GlobalRoute({component:Component,...rest}) {
    const {currentUser} = useAuth()
  return (
    <Route 
    
        {...rest}
    render={props=> {
        return currentUser ?  <Redirect to="/dashboard"/>:<Component {...props}/>
     }}
    >
    </Route>
    
  )
}
