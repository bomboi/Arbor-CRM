import React , {useState} from 'react'
import { DatePicker, Input } from 'antd';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails/OrderDetails';
import {
    BrowserRouter as Router,
    Switch,
    Route
  } from "react-router-dom";

const Orders = () => {

    let [listView, setListView] = useState('list')

    const setView = (value) => setListView(value)

    const changeView = (value) => {
        // TODO: Change to <Switch/> component and use urls
        switch (value) {
            case 'list':
                console.log('list')
                return <OrderList changeView={setView}/>
            case 'order details':
                console.log('order details')
                return <OrderDetails changeView={setView}/>
        }
    }

    // return changeView(listView);
    return (
        <Switch>
            <Route exact path="/porudzbine">
                <OrderList/>
            </Route>
            <Route exact path="/porudzbine/dodaj">
                <OrderDetails/>
            </Route>
        </Switch>
    )
}

export default Orders

