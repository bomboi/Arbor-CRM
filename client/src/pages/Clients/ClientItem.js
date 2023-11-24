import React, { useEffect } from 'react';
import { Card, PageHeader } from 'antd';
import Axios from 'axios';
import { clientsSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';

const ClientItem = (props) => {
    return (
        <Card>
            {props.client.name} 
            {props.client.username}
        </Card>
    );
}

const mapStateToProps = (state) => ({
    // isAdmin: isAdmin(state),
    clients: getClients(state),
    areClientsInitialized: areClientsInitialized(state)
})

export default connect(mapStateToProps)(ClientItem);