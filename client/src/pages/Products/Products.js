/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { PageHeader, Button, Row, Col, Card, List, Input, message, Spin } from 'antd';
import Axios from 'axios';
import { ProductListItem, ProductListHeader } from './ProductListItem';
import { connect } from 'react-redux'
import AddProduct from './Modals/AddProduct';
import ProductsPDF from './ProductsPDF';
import UpdateProduct from './Modals/UpdateProduct';
import { getProducts, areAllSelected, selectedProducts } from '@selectors/productsSelectors';
import { modalSlice, selectProductSlice, productSlice } from '@reducers/productsReducers';
import { isAdmin } from '@selectors/appSelectors';

const Products = (props) => {
    
    const [searchString, setSearchString] = useState('')

    const [isUploadingPrices, setIsUploadingPrices] = useState(false);

    useEffect(() => {
        if(props.products.length === 0) {
            Axios.get('/api/product/all').then(result => {
                props.dispatch(productSlice.actions.initProducts(result.data))
            })
        }

        const fileSelect = document.getElementById("fileSelect");
        const fileElem = document.getElementById("fileElem");

        fileSelect.addEventListener("click", (e) => {
            if (fileElem) {
                fileElem.click();
            }
        }, false);

        fileElem.addEventListener("change", handleFiles, false);
        
        function handleFiles() {
            if(this.files.length == 0) return;
            const file = this.files[0]; /* now you can work with the file list */
            var formData = new FormData();
            formData.append('prices', file)

            setIsUploadingPrices(true);
            props.dispatch(productSlice.actions.initProducts([]))
            Axios.post('/api/product/upload-prices', formData, {
                headers: {
                  'Content-Type': 'multipart/form-data'
                }
            })
            .then(res => {
                Axios.get('/api/product/all').then(result => {
                    props.dispatch(productSlice.actions.initProducts(result.data))
                })
                this.files = []
                setIsUploadingPrices(false);
            })
            .catch(e => {
                console.log(e)
                setIsUploadingPrices(false);
            })
        }

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
        extraPageHeaderElements.push(<Button id='fileSelect' key='1'>{isUploadingPrices && <Spin />} &nbsp;Importuj cenovnik</Button>)
        extraPageHeaderElements.push(<Button key='1' type="primary" onClick={()=>props.dispatch(modalSlice.actions.toggleShow('AddProduct'))}>Dodaj proizvod</Button>)
        extraPageHeaderElements.push(<input
            type="file"
            id="fileElem"
            accept=".csv"
            style={{display: 'none'}} />)
    }

    const toggleSelect = () => props.dispatch(selectProductSlice.actions.toggleSelectAllProducts(props.products));

    const deleteSelected = () => {
        console.log("Products to remove");
        console.log(props.selectedProducts);
        Axios.post('/api/product/delete', props.selectedProducts)
            .then(res => {
                props.dispatch(productSlice.actions.removeProducts(props.selectedProducts));
                message.success("Uspesno obrisani proizvodi!");
            })
            .catch(error => {
                message.error(error.response.data);
            });
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
                            <Button onClick={toggleSelect}>{props.allSelected?'Odselektuj sve':'Selektuj sve'}</Button>
                            <Button onClick={deleteSelected}>Obrisi selektovane</Button>
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
        isAdmin: isAdmin(state),
        selectedProducts: selectedProducts(state)
})

export default connect(mapStateToProps)(Products)