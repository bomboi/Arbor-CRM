import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    useRouteMatch
  } from "react-router-dom";
import ProtectedRoute from '../../../routing/ProtectedRoute';
import SuperAdminSettings from '../../Settings/SuperAdminSettings';
import SuperAdminStatistics from '../../Statistics/SuperAdminStatistics';
import Clients from '../../Clients/Clients';

import { Redirect } from 'react-router-dom/cjs/react-router-dom';

export default function MenuSwitch() {
    let match = useRouteMatch();
    console.log(match)
    return (
        // <Router>
            <Switch>
                <ProtectedRoute designatedRole="superadmin" path="/klijenti">
                    <Clients />
                </ProtectedRoute>
                <ProtectedRoute designatedRole="superadmin" path="/podesavanja">
                    <SuperAdminSettings />
                </ProtectedRoute>
                <ProtectedRoute designatedRole="superadmin" path="/statistika">
                    <SuperAdminStatistics />
                </ProtectedRoute>
                <ProtectedRoute defaultRoute path="/">
                    <Redirect to="/klijenti" />
                </ProtectedRoute>
            </Switch>
        // </Router>
    )
}
