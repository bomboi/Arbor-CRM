import React, { useEffect, useState } from 'react'
import { Input, InputNumber, Card, AutoComplete, Divider, Switch, Typography, Select, Checkbox, Alert, Button} from 'antd';
import { connect } from 'react-redux';
import Axios from 'axios';
import Label from '../../../components/Label';
import { Row, Col } from 'antd';

// Redux
import { getCustomers, areCustomersInitialized } from '@selectors/customersSelectors';
import { customerSlice } from '@reducers/customersReducers';
import { newOrderCustomerSlice } from '@reducers/ordersReducers';
import { getNewOrderCustomer, 
        isExistingCustomer, 
        isExistingCustomerChanged,
        usingDelivery } from '@selectors/ordersSelectors';

const createKeyValue = (key, value) => {
    return {
        key, 
        value
    }
}

const { Title } = Typography;

const CustomerDetails = (props) => {

    let [delivery, setDelivery] = useState(true);

    useEffect(() => {
        if(!props.areCustomersInitialized) {
            Axios.get('/api/customer/all').then(result => {
                props.dispatch(customerSlice.actions.initCustomers(result.data))
            })
        }
    }, []);

    const onSelect = (value, option) => {
        console.log(option.key);
        props.dispatch(newOrderCustomerSlice.actions.setCustomer(props.customers.filter(customer => customer._id === option.key)[0]))
    }

    const onChangeField = (value, key, address = false) => {
        props.dispatch(newOrderCustomerSlice.actions.updateCustomer({...createKeyValue(key, value), address}));
    }

    return (
        <Card className='mb-3'> 
            <Title level={4}>Kupac</Title>
            {props.existing && !props.existingChanged && <Alert message="Informacije kupca iz baze." type="info" showIcon />}
            {props.existing && props.existingChanged && 
                <Alert 
                    message="Menjate kupca iz baze!" 
                    closable 
                    closeText={'Novi kupac'} 
                    type="warning" 
                    onClose={()=>props.dispatch(newOrderCustomerSlice.actions.newFromExisting())} 
                    showIcon />}
            <Label text={'Ime kupca'}/>
            <AutoComplete
                className="w-100"
                onChange={(value) => onChangeField(value, 'name')}
                onSelect={onSelect}
                placeholder="Unesite ime kupca">
                    {props.customers.map(customer => (
                        <AutoComplete.Option key={customer._id} value={customer.name}>
                            <div>
                                <b>{customer.name}</b>
                            </div>
                            <div>
                                {customer.phone}
                            </div>
                        </AutoComplete.Option>
                    ))}
            </AutoComplete>
            <Label text={'Broj telefona'}/>
            <Input onChange={(e)=>onChangeField(e.target.value, 'phone')} value={props.customer.phone} placeholder={'Broj telefona'}/>
            <Label text={'Email adresa'}/>
            <Input onChange={(e)=>onChangeField(e.target.value, 'email')} value={props.customer.email} placeholder={'Email adresa'}></Input>
            <Title level={5} className="mt-3 d-flex justify-content-between align-items-center">
                <div>Dostava</div> 
                <Switch defaultChecked={props.delivery} size={'small'} onChange={(checked) => props.dispatch(newOrderCustomerSlice.actions.toggleDelivery(checked))}/>
            </Title>
            {props.delivery && <>
            <Divider className="m-0 mt-1"/>
            <Row>
                <Col className="w-100">
                    <Label text={'Adresa'}/>
                    <Input 
                        onChange={(e)=>onChangeField(e.target.value, 'street', true)} 
                        value={props.customer.address?props.customer.address.street:undefined} 
                        placeholder={'Adresa'}/>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={10}><Label text={'Sprat'}/></Col>
                <Col span={10}><Label text={'Tip objekta'}/></Col>
                <Col span={4}><Label text={'Lift'}/></Col>
            </Row>
            <Row gutter={10}>
                <Col span={10}>
                    <InputNumber 
                        className="w-100"
                        onChange={(value)=>onChangeField(value, 'floor', true)}
                        value={props.customer.address?props.customer.address.floor:undefined} 
                        placeholder={'Sprat'}/></Col>
                <Col span={10}>
                    <Select 
                        className="w-100" 
                        onChange={(value)=>onChangeField(value, 'homeType', true)}
                        value={props.customer.address?props.customer.address.homeType:undefined} 
                        placeholder={'Tip objekta'}>
                        <Select.Option value={'stan'}>Stan</Select.Option>
                        <Select.Option value={'kuca'}>Kuca</Select.Option>
                        <Select.Option value={'drugo'}>Drugo</Select.Option>
                    </Select>
                </Col>
                <Col span={4}>
                    <Checkbox
                        onChange={(e)=>onChangeField(e.target.checked, 'elevator', true)} 
                        checked={props.customer.address?props.customer.address.elevator:undefined} 
                        placeholder={'Lift'}/>
                </Col>
            </Row>
            </>}
        </Card>
    )
}

const mapStateToProps = (state) => ({
    customers: getCustomers(state),
    areCustomersInitialized: areCustomersInitialized(state),
    customer: getNewOrderCustomer(state),
    existing: isExistingCustomer(state),
    existingChanged: isExistingCustomerChanged(state),
    delivery: usingDelivery(state)
})

export default connect(mapStateToProps)(CustomerDetails)
