import React, { useEffect, useState } from 'react';
import { PageHeader, Button } from 'antd';
import Axios from 'axios';
import { clientsSlice, modalSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';
import ClientItem from './ClientItem';
import AddClient from './Modals/AddClient';

const Clients = (props) => {

    const addClient = () => {
        props.dispatch(modalSlice.actions.toggleShow('AddClient'));
    }

    let extraPageHeaderElements = [
        <Button onClick={addClient} type='primary'>Dodaj</Button>
    ]

    useEffect(() => {
        if(!props.areClientsInitialized) {
            Axios.get('/api/client/all')
                .then(res => {
                    props.dispatch(clientsSlice.actions.initClients(res.data))
                });
        }
    }, []);

    return (
        <div>
            <PageHeader
            ghost={false}
            title="Klijenti"
            className="mb-3"
            extra={extraPageHeaderElements}/>
            <AddClient/>

            {props.clients.map((client, index) => (<ClientItem client = {client} index={index}/>))}
        </div>
    )
}

const mapStateToProps = (state) => ({
    // isAdmin: isAdmin(state),
    clients: getClients(state),
    areClientsInitialized: areClientsInitialized(state)
})

export default connect(mapStateToProps)(Clients);
