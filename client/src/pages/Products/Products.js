/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { PageHeader, Button, Row, Col, Card, List, Input } from 'antd';
import Axios from 'axios';
import { ProductListItem, ProductListHeader } from './ProductListItem';
import { connect } from 'react-redux'
import AddProduct from './Modals/AddProduct';
import ProductsPDF from './ProductsPDF';
import UpdateProduct from './Modals/UpdateProduct';
import { getProducts, areAllSelected } from '@selectors/productsSelectors';
import { modalSlice, selectProductSlice, productSlice } from '@reducers/productsReducers';
import { isAdmin } from '@selectors/appSelectors';

const Products = (props) => {
    
    const [searchString, setSearchString] = useState('')

    useEffect(() => {
        Axios.get('/api/product/all').then(result => {
            props.dispatch(productSlice.actions.initProducts(result.data))
        })
    }, [])

    const onSearch = (e) => {
        setSearchString(e.target.value)
    }

    const listProducts = () => {
        if(searchString === '') return props.products
        else return props.products.filter(item=>item.productName.toLowerCase().includes(searchString.toLowerCase()))
    }

    let extraPageHeaderElements = [<ProductsPDF/>]

    console.log('isAdmin: ' + props.isAdmin)

    if(props.isAdmin) {
        extraPageHeaderElements.push(<Button key='1' type="primary" onClick={()=>props.dispatch(modalSlice.actions.toggleShow('AddProduct'))}>Dodaj proizvod</Button>)
    }

    return (
        <div>
        <PageHeader
        ghost={false}
        title="Proizvodi"
        className="mb-3"
        extra={extraPageHeaderElements}/>
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
                        {props.isAdmin && 
                            <>
                            <Button>Izmeni selektovane</Button>
                            <Button onClick={()=>props.dispatch(selectProductSlice.actions.toggleSelectAllProducts(props.products))}>
                                {props.allSelected?'Odselektuj sve':'Selektuj sve'}
                            </Button>
                            <Button>Obrisi selektovane</Button>
                            <Button>Obrisi sve</Button>
                            </>
                        }
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
const mapStateToProps = (state) => ({
        products: getProducts(state),
        allSelected: areAllSelected(state),
        isAdmin: isAdmin(state)
})

export default connect(mapStateToProps)(Products)