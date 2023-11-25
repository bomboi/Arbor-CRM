import React, { useEffect, useState } from 'react';
import { PageHeader, Button, Modal } from 'antd';
import Axios from 'axios';
import { clientsSlice, modalSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';
import { isModalVisible } from '../../../Redux/selectors/clientsSelectors';


const AddClient = (props) => {

    const [isAddModalOpen, setAddModalOpen] = useState(false);

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('AddClient'));
    }

    // let extraPageHeaderElements = [
    //     <Button onClick={addClient} type='primary'>Dodaj</Button>
    // ]

    // useEffect(() => {
    //     if(!props.areClientsInitialized) {
    //         Axios.get('/api/client/all')
    //             .then(res => {
    //                 props.dispatch(clientsSlice.actions.initClients(res.data))
    //             });
    //     }
    // }, []);

    return (
        <Modal
        title = "Dodaj klijenta"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Dodaj"
        // onOk = {addProduct}
        cancelText = "Zatvori"
        onCancel = {onCancel}
        >
            <div>asda</div>
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
