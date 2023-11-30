import React, { useEffect } from 'react';
import { Card, Switch} from 'antd';
import { DeleteOutlined } from '@ant-design/icons'
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

    const deleteClient = () => {
        Axios.post('/api/client/delete', {username: props.client.username})
            .then(res => {
                props.dispatch(clientsSlice.actions.removeClient(props.index))
            })
            .catch(error => {
                console.log(error)
            })
    }

    return (
        <Card>
            <div className='d-flex justify-content-between align-items-center'>
                <div>
                    <div><b>{props.client.name}</b></div> 
                    <div>@{props.client.username}</div> 
                </div>
                <div>
                    <div>{props.client.plan}</div>
                    <Switch checked = {props.client.active} onChange={toggleActive}/>
                    <DeleteOutlined onClick={deleteClient} className='p-2' style={{color:'red'}} />
                </div>
            </div>
        </Card>
    );
}

const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(ClientItem);