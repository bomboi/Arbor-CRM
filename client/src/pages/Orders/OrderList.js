import React from 'react'
import { useHistory } from "react-router-dom";
import { Button, Row, Col, List, Select, DatePicker, Input, PageHeader, Card, Divider } from 'antd';
import OrderListItem from './OrderListItem';

const { RangePicker } = DatePicker;
const { Search } = Input;


const OrderList = (props) => {
    let history = useHistory();

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
                            placeholder="Unesite broj porudzbine"
                            onSearch={value => console.log(value)}
                            style={{ width: 300 }}
                            />
                        <RangePicker
                            className='mr-3'
                            placeholder={['Pocetni datum', 'Krajnji datum']}
                            format={'DD/MM/YYYY'}/>
                        <Select defaultValue="ordered" className='mr-3' style={{ width: 120 }}>
                            <Select.Option value="all">Sve</Select.Option>
                            <Select.Option value="ordered">Poruceno</Select.Option>
                            <Select.Option value="making">U izradi</Select.Option>
                            <Select.Option value="made">Za isporuku</Select.Option>
                            <Select.Option value="delivired">Isporuceno</Select.Option>
                            <Select.Option value="archived">Arhivirano</Select.Option>
                        </Select>
                </Col>
            </Row>
            <Row>
                <Col flex={'auto'}>
                        <List 
                            bordered 
                            dataSource={['aaaa', 'bbb']} 
                            renderItem={(item) => <OrderListItem item={item}/>}/>
                </Col>
            </Row>
        </Card>
    </div>
    )
}

export default OrderList
