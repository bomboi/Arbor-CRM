import React, { useState } from 'react'
import { connect } from 'react-redux';
import { isModalVisible } from '@selectors/customersSelectors';
import { Modal, Row, Col, Input, InputNumber, Checkbox, Select } from 'antd';
import { modalSlice } from '@reducers/customersReducers';
import Axios from 'axios';
import { customerSlice } from '@reducers/customersReducers';

const AddCustomerModal = (props) => {

    const [customer, setCustomer] = useState({});

    const addCustomer = () => {
        // TODO: Add all conditions
        if(customer.name !== undefined && 
            customer.phone) {
            Axios.post('/api/customer/add', customer)
                .then(res => {
                    console.log(res)
                    props.dispatch(customerSlice.actions.addCustomer(res.data))
                    props.dispatch(modalSlice.actions.toggleShow('AddProduct'))
                    setCustomer({});
                })
        }
    }

    return (
        <Modal
            title = "Dodaj kupca"
            destroyOnClose
            visible = {props.visible}
            closable = {false}
            maskClosable = {false}
            okText = "Dodaj"
            onOk = {addCustomer}
            cancelText = "Zatvori"
            onCancel={()=>props.dispatch(modalSlice.actions.toggleShow('AddCustomerModal'))}>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input onChange={e=>{customer.name=e.target.value; setCustomer(customer)}} placeholder="Ime i prezime kupca"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{customer.phone=e.target.value; setCustomer(customer)}} placeholder="Telefon"/>
            </Col></Row>
            <Row gutter={[20,10]}>
                <Col flex={'auto'}>
                    <Input className="w-100" onChange={e=>{customer.address=e.target.value; setCustomer(customer)}} placeholder="Ulica"/>
                </Col>
                <Col flex={'auto'}>
                    <InputNumber className="w-100" onChange={e=>{customer.address=e.target.value; setCustomer(customer)}} placeholder="Sprat"/>
                </Col>
            </Row>
            <Row gutter={[20,10]}>
                <Col flex={'auto'}>
                    <Checkbox>Lift</Checkbox>
                </Col>
                <Col flex={'auto'}>
                    <Select defaultValue="stan" className="w-100">
                        <Select.Option value="stan">Stan</Select.Option>
                        <Select.Option value="kuca">Kuca</Select.Option>
                    </Select>
                </Col>
            </Row>

        </Modal>
    )
}

const mapStateToProps = (state) => ({
    visible: isModalVisible(state, 'AddCustomerModal')
})

export default connect(mapStateToProps)(AddCustomerModal);
