import React, { useState, useEffect } from 'react'
import {
    Route,
    Redirect
  } from "react-router-dom";
import { getUserRole } from '@selectors/appSelectors';
import { connect } from 'react-redux';
import Seller from '../pages/roles/seller/Seller';
import SuperAdmin from '../pages/roles/superadmin/SuperAdmin';
import Login from '../pages/Login/Login';
import Axios from 'axios';
import { orderDefaultsSlice } from '@reducers/appReducers';
import { Spin } from 'antd';
import { userSlice } from '@reducers/appReducers';

function RoleSwitch ({ userRole, dispatch, ...rest }) {
    
    return (
        <Route {...rest} render={() => {
            switch(userRole) {
                case 'superadmin':
                    return <SuperAdmin/>;
                case 'admin':
                case 'seller':
                    return <Seller/>;
                default:
                    return <Redirect to='/login' />;
            }
        }} />
    )
}

const mapStateToProps = (state) => ({
    userRole: getUserRole(state)
})


export default connect(mapStateToProps)(RoleSwitch);