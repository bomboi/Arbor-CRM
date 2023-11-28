import React from 'react'
import { Row, Col } from 'react-flexbox-grid';
import { Checkbox, Button } from 'antd';
import { connect } from 'react-redux'
import { isProductSelected } from '@selectors/productsSelectors';
import { modalSlice, productSlice, selectProductSlice } from '@reducers/productsReducers';
import { isAdmin } from '@selectors/appSelectors';

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
        </Row>
    )
}

export const UserListHeader = connect(mapStateToProps)(NCUserListHeader);

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

const NCProductListItem = (props) => {

    return (
        <Row className={"p-3 " + (props.selected && "bg-light")}>
            <Col xs>{props.item.firstName}</Col>
            <Col xs>{props.item.lastName}</Col>
            <Col xs>{props.item.username}</Col>
            <Col xs>{getRoleName(props.item.role)}</Col>
            <Col xs><Checkbox checked={props.item.active}/></Col>
        </Row>
    )
}

export const UserListItem = connect(mapStateToProps)(NCProductListItem);