import React, { useState } from 'react'
import { Row, Col } from 'react-flexbox-grid';
import { Checkbox, Button } from 'antd';
import { collect } from 'react-recollect';
import { connect } from 'react-redux'
import { toggleSelectedProduct, setCurrentProduct, toggleShowModal } from './Redux/actions';

const mapStateToProps = (state, props) => ({
    selected: state.selectProducts[props.id] !== undefined
})



export const ProductListHeader = () => {
    return (
        <Row className="pl-3 pr-3 pb-0">
            <Col xs><b>Naziv</b></Col>
            <Col xs><b>Cena</b></Col>
            <Col xs><b>Cena za gotovinsko</b></Col>
            <Col xs><b>Kolicina stofa</b></Col>
            <Col xs><b>Kategorija</b></Col>
            <Col xs></Col>
            <Col xs></Col>
        </Row>
    )
}

const NCProductListItem = (props) => {

    return (
        <Row className={"p-3 " + (props.selected && "bg-light")}>
            <Col xs>{props.item.productName}</Col>
            <Col xs>{props.item.price}</Col>
            <Col xs>{props.item.discountedPrice?props.item.discountedPrice:'/'}</Col>
            <Col xs>{props.item.materialLength?props.item.materialLength:'/'}</Col>
            <Col xs>{props.item.category?props.item.category:'/'}</Col>
            <Col xs><Checkbox checked={props.selected} onClick={()=>props.dispatch(toggleSelectedProduct(props.id))}/></Col>
            <Col xs><Button onClick={()=>{
                props.dispatch(toggleShowModal('UpdateProduct'))
                props.dispatch(setCurrentProduct(props.item))
            }}>Izmeni</Button></Col>
        </Row>
    )
}

export const ProductListItem = connect(mapStateToProps)(NCProductListItem);




