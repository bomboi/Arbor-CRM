import React from 'react';
import { PageHeader } from 'antd';
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
import { Redirect } from 'react-router-dom/cjs/react-router-dom';

export default function Clients() {

    let extraPageHeaderElements = []

    return (
        <div>
            <PageHeader
            ghost={false}
            title="Klijenti"
            className="mb-3"
            extra={extraPageHeaderElements}/>
        </div>
    )
}
