import React , {useState} from 'react'
import { Button, Row, Col, List, Select, DatePicker, Input } from 'antd';
import OrderListItem from './OrderListItem';
import OrderList from './OrderList';
import OrderDetails from './OrderDetails/OrderDetails';

const { RangePicker } = DatePicker;
const { Search } = Input;

const Orders = () => {

    let [listView, setListView] = useState('list')

    const setView = (value) => setListView(value)

    const changeView = (value) => {
        switch (value) {
            case 'list':
                console.log('list')
                return <OrderList changeView={setView}/>
            case 'order details':
                console.log('order details')
                return <OrderDetails changeView={setView}/>
        }
    }

    return changeView(listView);
}

export default Orders

