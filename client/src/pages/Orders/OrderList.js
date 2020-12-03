import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button, Row, Col, List, Select, DatePicker, Input, PageHeader, Card, Divider } from 'antd';
import OrderListItem from './OrderListItem';
import Axios from 'axios';
import { connect } from 'react-redux';
import { orderListSlice } from '@reducers/ordersReducers';
import { getOrderList, getLastOrderDate } from '@selectors/ordersSelectors';
import OrderPreview from './OrderPreview';

const { RangePicker } = DatePicker;
const { Search } = Input;

const PAGE_SIZE = 10;


const OrderList = (props) => {

    let [filters, setFilters] = useState({
        status: 'sve',
        orderId: '',
        range: ['', '']
    });

    let history = useHistory();

    useEffect(() => {
        load(true);
    }, [filters])
 
    const load = (init = false) => {
        console.log('Page change')
        let params = {
            pageSize: PAGE_SIZE,
            filters: filters,
            lastOrderDate: init ? null : props.lastOrderDate
        };
        console.log('params')
        console.log(params);
        Axios.get('/api/order/search', { params }).then(res => {
            if(init) props.dispatch(orderListSlice.actions.init(res.data))
            else props.dispatch(orderListSlice.actions.update(res.data))
        })
    }

    const update = (value, key) => {
        console.log('update')
        setFilters(prevState => ({...prevState, [key]: value}));
    }

    const updateRange = (value) => {
        setFilters(prevState => ({...prevState, range: value}))
    }

    return (
    <div>
        <PageHeader
      ghost={false}
      title="Porudzbine"
      className="mb-3"
      extra={[
        <Button key='1' type="primary" onClick={()=>history.push('/porudzbine/dodaj')}>Nova porudzbina</Button>
      ]}
    ></PageHeader>
        <Card>
            <Row>
                <Col flex={'auto'} className='mb-3'>
                        <Search
                            className='mr-3'
                            value={filters.orderId}
                            placeholder="Unesite broj porudzbine"
                            onChange={e => update(e.target.value, 'orderId')}
                            style={{ width: 300 }} />
                        <RangePicker
                            className='mr-3'
                            value={filters.range}
                            onChange={value => updateRange(value)}
                            placeholder={['Pocetni datum', 'Krajnji datum']}
                            format={'DD/MM/YYYY'}/>
                        <Select value={filters.status} className='mr-3' style={{ width: 120 }}>
                            <Select.Option value="sve">Sve</Select.Option>
                            <Select.Option value="poruceno">Poruceno</Select.Option>
                            <Select.Option value="u izradi">U izradi</Select.Option>
                            <Select.Option value="za isporuku">Za isporuku</Select.Option>
                            <Select.Option value="isporuceno">Isporuceno</Select.Option>
                            <Select.Option value="reklamacija">Reklamacija</Select.Option>
                            <Select.Option value="arhivirano">Arhivirano</Select.Option>
                        </Select>
                        <Select className='mr-3' style={{ width: 120 }}>
                            <Select.Option value="all">Po datumu najskorije</Select.Option>
                            <Select.Option value="ordered">Po najvecoj ceni</Select.Option>
                            <Select.Option value="made">Po najmanjoj ceni</Select.Option>
                            <Select.Option value="making">Po statusu porudzbine</Select.Option>
                        </Select>
                </Col>
            </Row>
            <Divider className="mt-1 mb-3"/>
            <Row className="mb-2">
                <Button>Selektuj sve</Button>
                <Button>Obrisi selektovane</Button>
                <Button>Selektuj sve</Button>
            </Row>
            <Row className="mt-2">
                <Col span={24}>
                    <List 
                        dataSource={props.orders} 
                        renderItem={(item) => <OrderListItem item={item}/>}/>
                </Col>
            </Row>
            <Row justify="center" className="mt-2">
                <Button className="align-self-center" onClick={()=>load()}>Ucitaj jos</Button>
            </Row>
        </Card>
        <OrderPreview/>
    </div>
    )
}

const mapStateToProps = (state) => ({
    orders: getOrderList(state),
    lastOrderDate: getLastOrderDate(state),
})

export default connect(mapStateToProps)(OrderList);
