import React, { useState, useEffect } from 'react'
import {
    Route,
    Redirect,
    useLocation
  } from "react-router-dom";
import Auth from './Auth';
import { getUserRole } from '@selectors/appSelectors';
import { connect } from 'react-redux';
import { Spin } from 'antd';

function ProtectedRoute ({ children, designatedRole, userRole, login, defaultRoute, ...rest }) {

    const [authenticated, setAuthenticated] = useState(undefined);
    const location = useLocation();

    useEffect(() => {
        console.log('ProtectedRoute: useEffects')
        Auth.isAuthenticated().then(res => {
            setAuthenticated(res);
        });
    }, [userRole]);

    return (
        <Route {...rest} render={() => {
            if(userRole == undefined) {
                if(authenticated == undefined){
                    return <div className="h-100 d-flex justify-content-center align-items-center"><Spin tip="Ucitavanje..."/></div>
                }
                if(authenticated) {
                    if(defaultRoute || login) return <Redirect to='/'/>
                    return children;
                } 
                if(login) return children;
                return <Redirect to='/login'/>;
            }
            else {
                if(authenticated == false) return <Redirect to='/login'/>
                if(login) return <Redirect to='/'/>
                let allowed = designatedRole === undefined || userRole === designatedRole;
                if(allowed) {
                    return children;
                }
                else return <Redirect to='/'/>;
            }
        }} />
    )
}

const mapStateToProps = (state) => ({
    userRole: getUserRole(state)
})


export default connect(mapStateToProps)(ProtectedRoute);