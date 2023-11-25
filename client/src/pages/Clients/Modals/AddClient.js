import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Modal } from 'antd';
import Axios from 'axios';
import { clientsSlice, modalSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';
import { isModalVisible } from '../../../Redux/selectors/clientsSelectors';
import { Row, Col, Input, InputNumber } from 'antd';


const AddClient = (props) => {

    const [isAddModalOpen, setAddModalOpen] = useState(false);
    const [name, setName] = useState('');
    const [username, setUsername] = useState('');

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('AddClient'));
    }

    const addClient = () => {
        Axios.post('/api/client/add', {
            name: name,
            username: username
        })
        .then(res => {
            props.dispatch(clientsSlice.actions.addClient(res.data))
            props.dispatch(modalSlice.actions.toggleShow('AddClient'))
        });
    }

    return (
        <Modal
        title = "Dodaj klijenta"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Dodaj"
        onOk = {addClient}
        cancelText = "Zatvori"
        onCancel = {onCancel}
        >
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{setUsername(e.target.value);}} placeholder="Username klijenta"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
                <Input onChange={e=>{setName(e.target.value);}} placeholder="Ime klijenta"/>
            </Col></Row>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    // isAdmin: isAdmin(state),
    clients: getClients(state),
    visible: isModalVisible(state, 'AddClient'),
    areClientsInitialized: areClientsInitialized(state)
})

export default connect(mapStateToProps)(AddClient);
