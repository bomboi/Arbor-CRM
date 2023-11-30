import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Input, Col, Alert, Select } from 'antd';
import Axios from 'axios';
import { getCurrentUser, isModalVisible } from '@selectors/usersSelectors';
import { modalSlice, usersSlice } from '@reducers/usersReducers';


const UpdateUser = (props) => {
        
    let [user, setUser] = useState({});
    let [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setUser({...props.user})
    }, [props.user])

    const usersAreSame = () => {
        if(props.user.firstName === user.firstName && 
            props.user.lastName === user.lastName &&
            props.user.username === user.username &&
            props.user.role === user.role) {
                setErrorMsg('Niste promenili korisnika')
                return true;
            }
        return false;
    }

    const addUser = () => {
        if(user.firstName !== '' && user.lastName !== '' && user.username !== '' && !usersAreSame()) {
            Axios.post('/api/user/update', user)
            .then(res => {
                    props.dispatch(usersSlice.actions.updateUser(user))
                    props.dispatch(modalSlice.actions.toggleShow('UpdateUser'))
                })
        }
    }

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('UpdateUser'))
        setErrorMsg('')
    }

    const roleValues = [
        {value: 'seller', label: 'Prodavac'},
        {value: 'external_seller', label: 'Eksterni prodavac'},
        {value: 'admin', label: 'Admin'},
        {value: 'factory', label: 'Proizvodnja'}
    ]

    return (
        <Modal
        title = "Izmeni korisnika"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Sacuvaj izmene"
        onOk = {addUser}
        cancelText = "Zatvori"
        onCancel = {onCancel}>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input value={user.firstName} onChange={e => {
                    setUser({...user, firstName:e.target.value})
                }} placeholder="Ime"/>
            </Col></Row>

            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input value={user.lastName} onChange={e => {
                    setUser({...user, price:e.target.value})
                }} className='w-100' lastName="Prezime"/>
            </Col></Row>

            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input value={user.username} onChange={e => {
                    setUser({...user, username:e.target.value})
                }} className='w-100' placeholder="Username"/>
            </Col></Row>

            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Select
                    className='w-100'
                    value={user.role}
                    onChange={role => {setUser({...user, role: role})}}
                    options={roleValues}
                />
            </Col></Row>
            {errorMsg!=='' && <Alert className="mt-3" message={errorMsg} type="error" showIcon />}
      </Modal>
    )
}

const mapStateToProps = (state) => ({
    user: getCurrentUser(state),
    visible: isModalVisible(state, 'UpdateUser')
})

export default connect(mapStateToProps)(UpdateUser)
