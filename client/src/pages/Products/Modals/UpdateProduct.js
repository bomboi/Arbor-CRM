import React, { Component, useState, useEffect } from 'react'
import { connect } from 'react-redux'
import { Modal, Row, Input, Col, InputNumber, Alert } from 'antd';
import Axios from 'axios';
import { toggleShowModal, updateProduct } from '../Redux/actions';


const UpdateProduct = (props) => {
        
    let [product, setProduct] = useState({});
    let [errorMsg, setErrorMsg] = useState('');
    console.log('render component')
    console.log(product)

    useEffect(() => {
        console.log('render')
        console.log(product)
        console.log(props.product)
        setProduct({...props.product})
        console.log('post-render')
        console.log(product)
    }, [props.product])

    const productsAreSame = () => {
        if(props.product.productName === product.productName && 
            props.product.price === product.price &&
            props.product.materialLength === product.materialLength &&
            props.product.category === product.category) {
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
                    props.dispatch(updateProduct(product))
                    props.dispatch(toggleShowModal('UpdateProduct'))
                })
        }
    }

    const onCancel = () => {
        props.dispatch(toggleShowModal('UpdateProduct'))
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
              <InputNumber value={product.materialLength} onChange={e => {
                    setProduct({...product, materialLength:e})
                }} className='w-100' placeholder="Kolicina stofa[m]"/>
              </Col></Row>
            <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input value={product.category} onChange={e => {
                    setProduct({...product, category:e.target.value})
                }} placeholder="Kategorija"/>
            </Col></Row>
            {errorMsg!=='' && <Alert className="mt-3" message={errorMsg} type="error" showIcon />}
      </Modal>
    )
}

const mapStateToProps = (state) => ({
    product: state.modal.currentProduct,
    visible: state.modal.show.UpdateProduct
})

export default connect(mapStateToProps)(UpdateProduct)
