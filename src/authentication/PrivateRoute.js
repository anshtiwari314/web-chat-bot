import React from 'react'
import {Route,Redirect} from 'react-router-dom'
import {useAuth}  from './AuthProvider'

export default function PrivateRoute({component:Component,...rest}) {
    const {currentUser} = useAuth()
    console.log('i am currenUser',currentUser)
  return (
    <Route 
    
        {...rest}
    render={props=> {
        return currentUser ? <Component {...props}/> : <Redirect to="/login"/>
     }}
    >
    </Route>
    
  )
}
