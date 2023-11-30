import React, { useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Input, Col, InputNumber, Alert } from 'antd';
import Axios from 'axios';
import { getCurrentProduct, isModalVisible } from '@selectors/productsSelectors';
import { modalSlice, productSlice } from '@reducers/productsReducers';


const UpdateProduct = (props) => {
        
    let [product, setProduct] = useState({});
    let [errorMsg, setErrorMsg] = useState('');

    useEffect(() => {
        setProduct({...props.product})
    }, [props.product])

    const productsAreSame = () => {
        if(props.product.productName === product.productName && 
            props.product.price === product.price &&
            props.product.discountedPrice === product.discountedPrice) {
                setErrorMsg('Niste promenili proizvod')
                return true;
            }
        return false;
    }

    const addProduct = () => {
        if(product.name !== '' && product.price !== '' && !productsAreSame()) {
            console.log('update')
            Axios.post('/api/product/update', product)
            .then(res => {
                    console.log(res)
                    setErrorMsg('')
                    props.dispatch(productSlice.actions.updateProduct(product))
                    props.dispatch(modalSlice.actions.toggleShow('UpdateProduct'))
                })
        }
    }

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('UpdateProduct'))
        setErrorMsg('')
    }

    return (
        <Modal
        title = "Izmeni proizvod"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Sacuvaj izmene"
        onOk = {addProduct}
        cancelText = "Zatvori"
        onCancel = {onCancel}>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input value={product.productName} onChange={e => {
                    setProduct({...product, productName:e.target.value})
                }} placeholder="Naziv proizvoda"/>
            </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <InputNumber value={product.price} onChange={e => {
                    setProduct({...product, price:e})
                }} className='w-100' placeholder="Cena"/>
              </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <InputNumber value={product.discountedPrice} onChange={e => {
                    setProduct({...product, discountedPrice:e})
                }} className='w-100' placeholder="Cena za gotovinsko"/>
              </Col></Row>
            {errorMsg!=='' && <Alert className="mt-3" message={errorMsg} type="error" showIcon />}
      </Modal>
    )
}

const mapStateToProps = (state) => ({
    product: getCurrentProduct(state),
    visible: isModalVisible(state, 'UpdateProduct')
})

export default connect(mapStateToProps)(UpdateProduct)
