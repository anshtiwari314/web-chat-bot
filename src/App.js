import React from 'react'
import LoginScreen from './authentication/LoginScreen'
import Dashboard from './authentication/Dashboard'
import { BrowserRouter ,Switch,Route } from 'react-router-dom'
import PrivateRoute from './authentication/PrivateRoute'
import GlobalRoute from './authentication/GlobalRoute'
import { AuthProvider } from './authentication/AuthProvider'
import Welcome from './authentication/Welcome'
import Bot from './components/Bot'

export default function App() {
  return (
    // <AuthProvider>
    //     <BrowserRouter>
    //         <Switch>
    //             <Route exact path="/" component={Welcome}/>
    //             <GlobalRoute path="/login" component={LoginScreen}/>
    //             <PrivateRoute path="/dashboard" component={Dashboard}/>
    //         </Switch>
    //     </BrowserRouter>
    //     <Bot localKey={null} cookieKey="sessionid"/>
    // </AuthProvider>
    <Bot localKey={null} cookieKey="sessionid"/>
  )
}
