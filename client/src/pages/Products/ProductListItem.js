import React from 'react'
import { Row, Col } from 'react-flexbox-grid';
import { Checkbox, Button } from 'antd';
import { connect } from 'react-redux'
import { isProductSelected } from '@selectors/productsSelectors';
import { modalSlice, productSlice, selectProductSlice } from '@reducers/productsReducers';
import { isAdmin } from '@selectors/appSelectors';

const mapStateToProps = (state, props) => ({
    selected: isProductSelected(state, props.id),
    isAdmin: isAdmin(state)
})

export const NCProductListHeader = (props) => {
    return (
        <Row className="pl-3 pr-3 pb-0">
            <Col xs><b>Naziv</b></Col>
            <Col xs><b>Cena</b></Col>
            <Col xs><b>Cena za gotovinsko</b></Col>
            {props.isAdmin && <Col xs></Col>}
            {props.isAdmin && <Col xs></Col>}
        </Row>
    )
}

export const ProductListHeader = connect(mapStateToProps)(NCProductListHeader);

const NCProductListItem = (props) => {

    return (
        <Row className={"p-3 " + (props.selected && "bg-light")}>
            <Col xs>{props.item.productName}</Col>
            <Col xs>{props.item.price}</Col>
            <Col xs>{props.item.discountedPrice?props.item.discountedPrice:'/'}</Col>
            {props.isAdmin && <Col xs><Checkbox checked={props.selected} onClick={()=>props.dispatch(selectProductSlice.actions.toggleSelectProduct(props.id))}/></Col>}
            {props.isAdmin && <Col xs><Button onClick={()=>{
                    props.dispatch(modalSlice.actions.toggleShow('UpdateProduct'))
                    props.dispatch(modalSlice.actions.setCurrentProduct(props.item))
                }}>Izmeni</Button></Col>}
        </Row>
    )
}

export const ProductListItem = connect(mapStateToProps)(NCProductListItem);