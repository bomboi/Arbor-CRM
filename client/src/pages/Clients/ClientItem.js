import React, { useEffect } from 'react';
import { Card, Switch } from 'antd';
import Axios from 'axios';
import { clientsSlice } from '@reducers/clientsReducers';
import { getClients, areClientsInitialized } from '@selectors/clientsSelectors';
import { connect } from 'react-redux';

const ClientItem = (props) => {

    const toggleActive = (checked) => {
        Axios.post('/api/client/set-active', {active: checked, username: props.client.username})
            .then(res => {
                props.dispatch(clientsSlice.actions.toggleActive({
                    index: props.index,
                    active: checked
                }))
            })
    }

    return (
        <Card>
            <div className='d-flex justify-content-between align-items-center'>
                <div><b>{props.client.name}</b> @{props.client.username} </div>
                <Switch checked = {props.client.active} onChange={toggleActive}/>
            </div>
        </Card>
    );
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(ClientItem);