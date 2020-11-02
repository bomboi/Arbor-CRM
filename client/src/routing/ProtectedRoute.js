import React, { useState } from 'react'
import {
    Route,
    Redirect
  } from "react-router-dom";
import Auth from './Auth';

function ProtectedRoute ({ children, ...rest }) {

    const [authenticated, setAuthenticated] = useState(true);

    return (
        <Route {...rest} render={() => {
            Auth.isAuthenticated().then(res=>setAuthenticated(res));
            return authenticated === true
            ? children
            : <Redirect to='/login' />
        }} />
    )
}

export default ProtectedRoute;