/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { PageHeader, Button, Row, Col, Card, List, Input } from 'antd';
import Axios from 'axios';
import { ProductListItem, ProductListHeader } from './ProductListItem';
import { connect } from 'react-redux'
import { toggleSelectAllProducts, initProducts, toggleShowModal } from './Redux/actions';
import AddProduct from './Modals/AddProduct';
import ProductsPDF from './ProductsPDF';
import UpdateProduct from './Modals/UpdateProduct';
import { getProducts } from '@selectors/productsSelectors';

const Products = (props) => {

    const isAdmin = props.isAdmin ? true : false

    const [searchString, setSearchString] = useState('')

    useEffect(() => {
        Axios.get('/api/product/all').then(result => {
            props.dispatch(initProducts(result.data))
        })
    }, [])

    const onSearch = (e) => {
        setSearchString(e.target.value)
    }

    const listProducts = () => {
        if(searchString === '') return props.products
        else return props.products.filter(item=>item.productName.toLowerCase().includes(searchString.toLowerCase()))
    }

    return (
        <div>
        <PageHeader
        ghost={false}
        title="Proizvodi"
        className="mb-3"
        extra={[
            <ProductsPDF/>,
            <Button key='1' type="primary" onClick={()=>props.dispatch(toggleShowModal('AddProduct'))}>Dodaj proizvod</Button>,
        ]}
        ></PageHeader>
        <AddProduct />
        <UpdateProduct />
        <Card>
            <Row>
                <Col flex={'auto'} className='mb-3'>
                        <Input
                            className='mr-3'
                            placeholder="Unesite naziv proizvoda"
                            onChange={onSearch}
                            style={{ width: 300 }}
                            />
                        <Button>Izmeni selektovane</Button>
                        <Button onClick={()=>props.dispatch(toggleSelectAllProducts(props.products))}>
                            {props.allSelected?'Odselektuj sve':'Selektuj sve'}
                        </Button>
                </Col>
            </Row>
            <Row>
                <Col flex={'auto'}>
                        <List 
                            header={<ProductListHeader />}
                            dataSource={listProducts()} 
                            renderItem={item => 
                                <div>
                                    <ProductListItem id={item._id} item={item}/>
                                </div>}/>
                </Col>
            </Row>
        </Card>
        </div>
    )
}
const mapStateToProps = (state) => (()=>{
    console.log(state.productsReducer.productsSlice)
    return {
        products: getProducts(state),
        allSelected: Object.keys(state.productsReducer.selectProductSlice).length === getProducts(state).length
    }
})

export default connect(mapStateToProps)(Products)