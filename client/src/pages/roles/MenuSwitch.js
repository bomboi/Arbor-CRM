import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    useRouteMatch
  } from "react-router-dom";
import Orders from '../Orders/Orders';
import Customers from '../Customers/Customers';
import Products from '../Products/Products';
import ProtectedRoute from '../../routing/ProtectedRoute';
import Settings from '../Settings/Settings';
import Statistics from '../Statistics/Statistics';
import Users from '../Users/Users';
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

export default function MenuSwitch() {
    let match = useRouteMatch();
    console.log(match)
    return (
        // <Router>
            <Switch>
                <ProtectedRoute path="/porudzbine">
                    <Orders />
                </ProtectedRoute>
                <ProtectedRoute path="/kupci">
                    <Customers />
                </ProtectedRoute>
                <ProtectedRoute path="/proizvodi">
                    <Products />
                </ProtectedRoute>
                <ProtectedRoute path="/podesavanja">
                    <Settings />
                </ProtectedRoute>
                <ProtectedRoute designatedRole="admin" path="/statistika">
                    <Statistics />
                </ProtectedRoute>
                <ProtectedRoute designatedRole="admin" path="/korisnici">
                    <Users />
                </ProtectedRoute>
                <ProtectedRoute defaultRoute path="/">
                    <Redirect to="/porudzbine" />
                </ProtectedRoute>
            </Switch>
        // </Router>
    )
}
