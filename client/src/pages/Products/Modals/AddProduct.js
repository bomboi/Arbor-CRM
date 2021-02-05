import React, { useState } from 'react'
import { connect } from 'react-redux'
import Modal from 'antd/lib/modal/Modal';
import { Row, Col, Input, InputNumber } from 'antd';
import Axios from 'axios';
import { modalSlice, productSlice } from '@reducers/productsReducers';
import { isModalVisible } from '@selectors/productsSelectors';

const AddProduct = (props) => {

    const [product, setProduct] = useState({});

    const addProduct = () => {
        if(product.name !== undefined && product.price !== undefined) {
            Axios.post('/api/product/add', product)
                .then(res => {
                    console.log(res)
                    props.dispatch(productSlice.actions.addProducts(res.data))
                    props.dispatch(modalSlice.actions.toggleShow('AddProduct'))
                })
        }
    }

    const onCancel = () => {
        props.dispatch(modalSlice.actions.toggleShow('AddProduct'))
    }

    return (
        <Modal
        title = "Dodaj proizvod"
        destroyOnClose
        visible = {props.visible}
        closable = {false}
        maskClosable = {false}
        okText = "Dodaj"
        onOk = {addProduct}
        cancelText = "Zatvori"
        onCancel = {onCancel}>
          <Row gutter={[20,10]}><Col flex={'auto'}>
              <Input onChange={e=>{product.name=e.target.value; setProduct(product)}} placeholder="Naziv proizvoda"/>
          </Col></Row>
          <Row gutter={[20,10]}><Col flex={'auto'}>
              <InputNumber onChange={e=>{product.price=e; setProduct(product)}} className='w-100' placeholder="Cena"/>
              </Col></Row>
          <Row gutter={[20,10]}><Col flex={'auto'}>
              <InputNumber onChange={e=>{product.discountedPrice=e; setProduct(product)}} className='w-100' placeholder="Cena za gotovinsko"/>
              </Col></Row>
      </Modal>
    )
}

const mapStateToProps = (state) => ({
    visible: isModalVisible(state, 'AddProduct')
})

export default connect(mapStateToProps)(AddProduct)
