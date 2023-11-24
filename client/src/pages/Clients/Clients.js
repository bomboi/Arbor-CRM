import React, { useEffect } from 'react';
import { PageHeader } from 'antd';
import Axios from 'axios';
import { clientsSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';
import ClientItem from './ClientItem';

const Clients = (props) => {

    let extraPageHeaderElements = []

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

            {props.clients.map(client => (<ClientItem client = {client}/>))}
        </div>
    )
}

const mapStateToProps = (state) => ({
    // isAdmin: isAdmin(state),
    clients: getClients(state),
    areClientsInitialized: areClientsInitialized(state)
})

export default connect(mapStateToProps)(Clients);
