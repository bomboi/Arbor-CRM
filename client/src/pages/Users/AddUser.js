import React, { useState } from 'react'
import { connect } from 'react-redux'
import Modal from 'antd/lib/modal/Modal';
import { Row, Col, Input, InputNumber, Select } from 'antd';
import Axios from 'axios';
import { isModalVisible } from '@selectors/productsSelectors';
import { usersSlice, modalSlice } from '../../Redux/reducers/usersReducers';

const AddUser = (props) => {

    const [user, setUser] = useState({});
    const [role, setRole] = useState('admin')

    const addUser = () => {
        if(user.firstName !== undefined && 
            user.lastName !== undefined &&
            user.username !== undefined) {
            
            user.role = role;
            user.active = true;
            Axios.post('/api/user/add', user)
                .then(res => {
                    console.log(res)
                    props.dispatch(usersSlice.actions.addUser(res.data))
                    props.dispatch(modalSlice.actions.toggleShow('AddUser'))
                })
        }
        else {
            console.log('Nisu sva polja popunjena!')
        }
    }

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('AddUser'))
    }

    const roleValues = [
        {value: 'seller', label: 'Prodavac'},
        {value: 'external_seller', label: 'Eksterni prodavac'},
        {value: 'admin', label: 'Admin'},
        {value: 'factory', label: 'Proizvodnja'}
    ]

    const onSelect = (text) => {
        setRole(text);
    }

    return (
        <Modal
        title = "Dodaj korisnika"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Dodaj"
        onOk = {addUser}
        cancelText = "Zatvori"
        onCancel = {onCancel}>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{user.firstName=e.target.value; setUser(user)}} placeholder="Ime"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{user.lastName=e.target.value; setUser(user)}} className='w-100' placeholder="Prezime"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{user.username=e.target.value; setUser(user)}} className='w-100' placeholder="Username"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Select
                    className='w-100'
                    value={role}
                    onChange={onSelect}
                    options={roleValues}
                />
            </Col></Row>
      </Modal>
    )
}

const mapStateToProps = (state) => ({
    visible: isModalVisible(state, 'AddUser')
})

export default connect(mapStateToProps)(AddUser)
