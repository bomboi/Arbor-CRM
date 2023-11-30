/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { PageHeader, Button, Row, Col, Card, List, Input, message, Spin } from 'antd';
import { connect } from 'react-redux'
import { UserListItem, UserListHeader } from './UserListItem';
import { getUsers } from '@selectors/usersSelectors';
import Axios from 'axios'; 
import { usersSlice, modalSlice } from '@reducers/usersReducers';
import AddUser from './AddUser';
import UpdateUser from './UpdateUser';

const Users = (props) => {
    const extraPageHeaderElements = [
        <Button key='1' type="primary" onClick={()=>props.dispatch(modalSlice.actions.toggleShow('AddUser'))}>Dodaj korisnika</Button>
    ]

    useEffect(() => {
        if(props.users.length === 0) {
            Axios.get('/api/user/all').then(result => {
                props.dispatch(usersSlice.actions.initUsers(result.data))
            })
        }
    }, []);

    return (
        <div>
        <PageHeader
        ghost={false}
        title="Korisnici"
        className="mb-3"
        extra={extraPageHeaderElements}/>
            <AddUser/>
            <UpdateUser/>
            <Card>
                <List 
                    header={<UserListHeader />}
                    dataSource={props.users} 
                    renderItem={item => 
                        <div>
                            <UserListItem id={item._id} item={item}/>
                        </div>}/>
            </Card>
        </div>
    )
}
const mapStateToProps = (state) => ({
    users: getUsers(state)
})

export default connect(mapStateToProps)(Users)