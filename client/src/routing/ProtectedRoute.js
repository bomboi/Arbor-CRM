import React, { useState } from 'react'
import {
    Route,
    Redirect
  } from "react-router-dom";
import Auth from './Auth';
import { getUserRole } from '@selectors/appSelectors';
import { connect } from 'react-redux';

function ProtectedRoute ({ children, designatedRole, userRole, ...rest }) {

    const [authenticated, setAuthenticated] = useState(true);

    return (
        <Route {...rest} render={() => {
            Auth.isAuthenticated().then(res => setAuthenticated(res));
            if(authenticated) {
                let allowed = designatedRole === undefined || userRole === designatedRole;
                if(allowed) {
                    return children;
                }
                else return children;
                // else redirect to not allowed
            }
            else return <Redirect to='/login' />;
        }} />
    )
}

const mapStateToProps = (state) => ({
    userRole: getUserRole(state)    
})


export default connect(mapStateToProps)(ProtectedRoute);