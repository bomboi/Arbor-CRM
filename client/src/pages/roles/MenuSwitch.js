import React from 'react'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link, useRouteMatch
  } from "react-router-dom";
import Orders from '../Orders/Orders';
import Customers from '../Customers/Customers';
import Products from '../Products/Products';
import ProtectedRoute from '../../routing/ProtectedRoute';

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
            </Switch>
        // </Router>
    )
}
