import React from 'react'
import { Row, Col } from 'react-flexbox-grid';
import { Checkbox, Button } from 'antd';
import { connect } from 'react-redux'
import Axios from 'axios';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { modalSlice, usersSlice } from '../../Redux/reducers/usersReducers';

const mapStateToProps = (state, props) => ({
    // selected: isProdSelected(state, props.id),
    // isAdmin: isAdmin(state)
})

export const NCUserListHeader = (props) => {
    return (
        <Row className="pl-3 pr-3 pb-0">
            <Col xs><b>Ime</b></Col>
            <Col xs><b>Prezime</b></Col>
            <Col xs><b>Username</b></Col>
            <Col xs><b>Uloga</b></Col>
            <Col xs><b>Aktivan</b></Col>
            <Col xs></Col>
        </Row>
    )
}

export const UserListHeader = connect(mapStateToProps)(NCUserListHeader);


const NCProductListItem = (props) => {
    
    const getRoleName = (role) => {
        switch(role) {
            case 'admin':
                return 'Admin';
            case 'seller':
                return 'Prodavac';
            case 'factory':
                return 'Proizvodnja';
        }
    } 
    
    const editUser = () => {
        props.dispatch(modalSlice.actions.toggleShow('UpdateUser'))
        props.dispatch(modalSlice.actions.setCurrentUser(props.item))
    }

    const toggleActive = (e) => {
        let updatedUser = {...props.item, active: e.target.checked};
        Axios.post('/api/user/set-active', updatedUser)
            .then(res => {
                props.dispatch(usersSlice.actions.toggleActive(updatedUser))
            })
    }

    const removeUser = () => {
        Axios.post('/api/user/delete', {id: props.item._id})
            .then(res => {
                props.dispatch(usersSlice.actions.removeUser(props.item._id))
            })
    }

    return (
        <Row className={"p-3 " + (props.selected && "bg-light")}>
            <Col xs >{props.item.firstName}</Col>
            <Col xs>{props.item.lastName}</Col>
            <Col xs>{props.item.username}</Col>
            <Col xs>{getRoleName(props.item.role)}</Col>
            <Col xs><Checkbox onClick={toggleActive} checked={props.item.active}/></Col>
            <Col xs>
                <Button onClick={editUser} type='text'><EditOutlined style={{color: 'gray'}}/></Button>
                <Button onClick={removeUser} type='text'><DeleteOutlined style={{color: 'gray'}}/></Button>
            </Col>
        </Row>
    )
}

export const UserListItem = connect(mapStateToProps)(NCProductListItem);