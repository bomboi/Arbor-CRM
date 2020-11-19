import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { isAdmin } from '@selectors/appSelectors';
import { PageHeader, Button, Card, Input, List, Row, Col } from 'antd';
import { CustomerListHeader, CustomerListItem } from './CustomerListItem';
import { modalSlice } from '@reducers/customersReducers';
import AddCustomerModal from './AddCustomerModal';
import Axios from 'axios';
import { customerSlice } from '@reducers/customersReducers';
import { getCustomers, areCustomersInitialized } from '@selectors/customersSelectors';

const Customers = (props) => {

    useEffect(() => {
        if(!props.areCustomersInitialized) {
            Axios.get('/api/customer/all').then(result => {
                props.dispatch(customerSlice.actions.initCustomers(result.data))
            })
        }
    }, []);

    const extraPageHeaderElements  = [<Button type="primary" onClick={()=>props.dispatch(modalSlice.actions.toggleShow('AddCustomerModal'))}>Dodaj kupca</Button>];

    return (
        <div>
            <PageHeader
            ghost={false}
            title="Kupci"
            className="mb-3"
            extra={extraPageHeaderElements}/>
            <AddCustomerModal />
            <Card>
                <Row>
                    <Col flex={'auto'} className='mb-3'>
                            <Input
                                className='mr-3'
                                placeholder="Unesite ime kupca"
                                // onChange={onSearch}
                                style={{ width: 300 }}/>
                    </Col>
                </Row>
                <Row>
                    <Col flex={'auto'}>
                        <List
                            header={<CustomerListHeader />}
                            dataSource={props.customers} 
                            renderItem={item => 
                                <div>
                                    <CustomerListItem id={item._id} item={item}/>
                                </div>}/>
                    </Col>
                </Row>
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => ({
    isAdmin: isAdmin(state),
    customers: getCustomers(state),
    areCustomersInitialized: areCustomersInitialized(state)
})

export default connect(mapStateToProps)(Customers);
