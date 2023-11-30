import React, { useState, useEffect } from 'react'
import Auth from './Auth';
import { getUserRole } from '@selectors/appSelectors';
import { connect } from 'react-redux';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";
import Login from '../pages/Login/Login';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'antd/dist/antd.css';
import ProtectedRoute from './ProtectedRoute';
import RoleSwitch from './RoleSwitch';
import Axios from 'axios';
import { orderDefaultsSlice } from '@reducers/appReducers';
import { userSlice } from '@reducers/appReducers';

const AppRouter = (props) => {

    useEffect(() => {
        Axios.get('/api/user/get')
          .then(result => {
            // Browser notifications
            // if (!("Notification" in window)) {
            //   console.log("Browser does not support desktop notification");
            // } else {
            //   console.log("Notification supported");
            //   Notification.requestPermission().then((permission) => {
            //     console.log(permission)
            //   });
            // }


            props.dispatch(userSlice.actions.initUser(result.data));
          })
          .catch(error => {
            console.log(error)
            // if(error.response.status == 403 || error.response.status == 401) {
            // }
          })
        Axios.get('/api/setting/order-defaults')
            .then(res => props.dispatch(orderDefaultsSlice.actions.init(res.data)))
            .catch(error => console.log(error));
      }, []);

    return (
        <Router>
          <Switch>
            <ProtectedRoute login path='/login'>
              <Login />
            </ProtectedRoute>
            <ProtectedRoute>
              <RoleSwitch path='/' />
            </ProtectedRoute>
          </Switch>
        </Router>
    )
}

const mapStateToProps = (state) => ({
    userRole: getUserRole(state)   
})


export default connect(mapStateToProps)(AppRouter);