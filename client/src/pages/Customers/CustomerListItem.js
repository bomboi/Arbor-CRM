import React from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-flexbox-grid';
import { Button } from 'antd';

const NCCustomerListHeader = () => {
    return (
        <Row className="pl-3 pr-3 pb-0">
            <Col xs><b>Ime i prezime</b></Col>
            <Col xs><b>Broj telefona</b></Col>
            <Col xs><b>Adresa</b></Col>
        </Row>
    )
}

const NCCustomerListItem = (props) => {
    return (
        <Row className="p-3">
            <Col xs>{props.item.name}</Col>
            <Col xs>{props.item.phone}</Col>
            <Col xs>{props.item.address && props.item.address.street}</Col>
        </Row>
    )
}

const mapStateToProps = (state) => ({
    
})

export const CustomerListHeader = connect(mapStateToProps)(NCCustomerListHeader);
export const CustomerListItem = connect(mapStateToProps)(NCCustomerListItem);