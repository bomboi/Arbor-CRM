import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Modal, Input, List, Card, Button, PageHeader } from 'antd';
import { getProducts } from '../../../Redux/selectors/productsSelectors';
import { productSlice } from '@reducers/productsReducers';
import Axios from 'axios';
import { newOrderNewArticleSlice } from '../../../Redux/reducers/ordersReducers';

const ProductsListModal = (props) => {

    let [searchText, setSearchText] = useState('');

    useEffect(()=>{
        if(props.products.length === 0) {
            Axios.get('/api/product/all').then(result => {
                props.dispatch(productSlice.actions.initProducts(result.data))
            })
        }
    }, [])

    let products = props.products.filter(item => item.productName.toLowerCase().startsWith(searchText.toLowerCase()));

    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            closable={false}
            centered
            cancelText={'Zatvori'}
            onOk={false}>
                <PageHeader
                    ghost={true}
                    title="Izaberi proizvod"
                    className="p-0"/>
                <Input value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder={'Ime prozivoda'}/>
                <div style={{overflowY:'scroll', height:400}}>
                    <List 
                        dataSource={products}
                        renderItem={item => (
                        <Card className="mt-2" bodyStyle={{padding: 10}}>
                            <div className="d-flex justify-content-between align-items-center">
                                <div className="d-flex justify-content-between w-100 mr-3">
                                    <div>{item.productName}</div>
                                    <div>{item.price} RSD</div>
                                </div>
                                <div>
                                    <Button onClick={()=>{
                                        props.dispatch(newOrderNewArticleSlice.actions.selectProduct({productName: item.productName, price: item.price}))
                                        props.onCancel();
                                    }}>Izaberi</Button>
                                </div>
                            </div>
                        </Card>)}/>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    products: getProducts(state)
})

export default connect(mapStateToProps)(ProductsListModal);
