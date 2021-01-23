import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Input, Divider, Button, Card, Tag, List, Select, Spin, Skeleton } from 'antd';
import { 
    isOrderPreviewVisible, 
    getOrderPreviewData, 
    getOrderPreviewVersions, 
    isOrderPreviewLoading, 
    getOrderPreviewIndex 
} from '@selectors/ordersSelectors';
import { connect } from 'react-redux';
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { 
    orderPreviewSlice,
    newOrderArticlesSlice, 
    newOrderInfoSlice, 
    newOrderCustomerSlice, 
    orderDetails, 
    orderListSlice
} from '@reducers/ordersReducers';
import { isAdmin } from '@selectors/appSelectors';
import { getTagColor } from '../../utils';
import Axios from 'axios';
import { isBrowser, isMobile, BrowserView, MobileView } from 'react-device-detect';
import OrderFactoryPDF from './OrderFactoryPDF';
import { OrderInvoicePDF } from './OrderDetails/OrderInvoicePDF';

const SelectVersion = (props) => {
    const genOptions = (number) => {
        let i = number;
        let options = []
        while(i > 0) {
            options.push(<Select.Option className="text-secondary" value={i}>Verzija {i}</Select.Option>)
            i--;
        }
        return options
    }

    return (
        <Select 
            className="text-secondary" 
            bordered={false} 
            defaultValue={props.number}
            onSelect={props.onSelect}>
            {genOptions(props.number)}
        </Select>
    )
}

const SkeletonRow = (props) => {
    return props.loading ? <Skeleton active paragraph={{rows:1}}/> :
        <Row>
            {props.children}
        </Row>
}

const OrderPreview = (props) => {

    let [version, setVersion] = useState(props.versions?props.versions.length - 1:0);
    let history = useHistory();
    let [firstState, setFirstState] = useState('');

    const selectVersion = (value) => {
        setVersion(value - 1);
    };

    useEffect(()=> {
        if(props.order != null && firstState === '') {
            setFirstState(props.order.state);
        }
    }, [props.order])

    useEffect(()=> {
        if(props.versions) {
            setVersion(props.versions.length - 1);
        }
    }, [props.versions])

    const onSelectOrderState = (value) => {
        Axios.post('/api/order/update-state', {
            orderId: props.order._id,
            state: value
        }).then(() => {
            setFirstState(value)
        })
    }

    const complaint = () => {
        Axios.post('/api/order/update-state', {
            orderId: props.order._id,
            state: 'reklamacija'
        }).then(() => {
            setFirstState('reklamacija')
        })
    }

    const deleteOrder = () => {
        // TODO: Set spinner while deleting
        Axios.post('/api/order/delete', {
            ids: [props.order._id]
        }).then(res => {
            // TODO: Check if deleted
            props.dispatch(orderListSlice.actions.deleteOrder(props.orderIndex));
            props.dispatch(orderPreviewSlice.actions.toggleShow());
        });
    }
    console.log('Version: ' + version)

    return (
        props.order === undefined ? <></> :
        <Modal 
            bodyStyle={{padding: 0}}
            width={1200}
            centered
            footer={null}
            visible={props.visible}
            closable = {false}>
            <Spin spinning={props.loading}>
            <BrowserView><Row justify={'space-between'} className="pl-4 pr-4 pt-3 pb-3">
                <div>
                    <Button onClick={deleteOrder} type={'primary'} className="mr-2" danger>Obrisi</Button>
                    <OrderInvoicePDF check={() => true} orderId={props.order?props.order.orderId:0}/>
                    {props.isAdmin && <OrderFactoryPDF version={version}/>}
                    <Button onClick={complaint} className="mr-2">Prijavi reklamaciju</Button>
                    <Button onClick={()=>{
                        props.dispatch(newOrderArticlesSlice.actions.setArticles(props.versions[props.versions.length - 1].data.articles))
                        props.dispatch(newOrderInfoSlice.actions.setOrderInfo(props.versions[props.versions.length - 1].data.orderInfo))
                        props.dispatch(newOrderCustomerSlice.actions.setCustomer({customer: props.order.customer, delivery: props.versions[props.versions.length - 1].data.orderInfo.delivery}));
                        props.dispatch(orderDetails.actions.initEditMode(true))
                        history.push('/porudzbine/izmeni/'+props.order.orderId);
                    }}>Izmeni</Button>
                </div>
                <Button onClick={()=>{
                    props.dispatch(orderPreviewSlice.actions.toggleShow());
                    props.dispatch(orderListSlice.actions.updateOrderState({index: props.orderIndex, state: firstState}))
                }}>Zatvori</Button>
            </Row></BrowserView>
            <MobileView>
                <Collapse ghost>
                    <Collapse.Panel header={'Opcije'}>
                        <div className="pl-4 pr-4 pt-3 pb-3 d-flex flex-column">
                        <Button onClick={deleteOrder} type={'primary'} className="mb-2" danger>Obrisi</Button>
                        <Button className="mb-2">Štampaj</Button>
                        {props.isAdmin && <OrderFactoryPDF className="mb-2 w-100" version={version}/>}
                        <Button className="mb-2">Prijavi reklamaciju</Button>
                        <Button className="mb-2" onClick={()=>{
                            props.dispatch(newOrderArticlesSlice.actions.setArticles(props.versions[props.versions.length - 1].data.articles))
                            props.dispatch(newOrderInfoSlice.actions.setOrderInfo(props.versions[props.versions.length - 1].data.orderInfo))
                            props.dispatch(newOrderCustomerSlice.actions.setCustomer({customer: props.order.customer, delivery: props.versions[props.versions.length - 1].data.orderInfo.delivery}));
                            props.dispatch(orderDetails.actions.initEditMode(true))
                            history.push('/porudzbine/izmeni/'+props.order.orderId);
                        }}>Izmeni</Button>
                        <Button onClick={()=>{
                            props.dispatch(orderPreviewSlice.actions.toggleShow());
                            props.dispatch(orderListSlice.actions.updateOrderState({index: props.orderIndex, state: firstState}))
                        }}>Zatvori</Button>
                        </div>
                    </Collapse.Panel>
                    <Collapse.Panel header={'Komentari'}>
                        <Col className="p-4 bg-light">
                            {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                        </Col>
                    </Collapse.Panel>
                </Collapse>
            </MobileView>
            <Divider className="m-0"/>
            <Row>
                <Col className="pl-4 pr-4 pb-4 pt-2" span={isMobile?24:18}>
                    {props.loading? <Skeleton active paragraph={{rows:0}}/> :<>
                        <div className={"d-flex justify-content-between " + (isMobile?"mb-2":"")}>
                            <small className="text-secondary mt-0">
                                <div>
                                    izdato od: {props.versions[0].changedBy.firstName} {props.versions[0].changedBy.lastName} 
                                </div>
                                <div>
                                    trenutna verzija: {props.versions[version].changedBy.firstName} {props.versions[version].changedBy.lastName}
                                </div>
                            </small>
                            <div>
                                {isMobile && <SelectVersion 
                                    onSelect={selectVersion}
                                    number={props.versions.length}/>}
                            </div>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex align-items-end">
                                <Title level={4} className="mb-0">#{props.order.orderId}</Title>
                            </div>
                            <div className="align-self-center">
                                {isBrowser && <SelectVersion 
                                    onSelect={selectVersion}
                                    number={props.versions.length}/>}
                                {!props.isAdmin ? 
                                <Tag color={'blue'} style={{fontSize:14}} className="mr-0">
                                    {props.order.state.toUpperCase()}
                                </Tag>
                                :
                                <Select 
                                    bordered={false} 
                                    value={firstState.toUpperCase()} 
                                    className={"ant-tag ant-tag-" + getTagColor(firstState)}
                                    onSelect={onSelectOrderState}>
                                    <Select.Option value="poruceno">Poruceno</Select.Option>
                                    <Select.Option value="u izradi">U izradi</Select.Option>
                                    <Select.Option value="za isporuku">Za isporuku</Select.Option>
                                    <Select.Option value="isporuceno">Isporuceno</Select.Option>
                                    <Select.Option value="reklamacija">Reklamacija</Select.Option>
                                    <Select.Option value="arhivirano">Arhivirano</Select.Option>
                                </Select>
                                }
                            </div>
                        </div>
                    </>}
            <Card bodyStyle={{padding:0}}>
                    <Collapse ghost style={{overflowY:'scroll', height:470}} defaultActiveKey={['customer', 'info', 'articles']}>
                        <Collapse.Panel key={'customer'} header={'Kupac' }>
                            <Card>
                                <SkeletonRow loading={props.loading}>
                                    <BrowserView viewClassName="w-100">
                                        {!props.loading && <>
                                        <Row>
                                            <Col span={6}>
                                                <Title level={4} className="mb-1">{props.order.customer.name}</Title>
                                                <div>{props.order.customer.phone}</div>
                                                <div>{props.order.customer.email}</div>
                                            </Col>
                                            {props.versions[version].data.orderInfo.delivery &&
                                                <Col span={6}>
                                                    <div>{props.order.customer.address.street} ({props.order.customer.address.homeType})</div>
                                                    <div>{props.order.customer.address.floor}. sprat ({props.order.customer.address.elevator?'ima lift':'nema lift'})</div>
                                                </Col>}
                                        </Row>
                                        </>}
                                    </BrowserView>
                                    <MobileView>
                                        {!props.loading && <>
                                            <Title level={4} className="mb-1">{props.order.customer.name}</Title>
                                            <div>{props.order.customer.phone}</div>
                                            <div>{props.order.customer.email}</div>
                                        {props.versions[version].data.orderInfo.delivery &&
                                            <>
                                                <div>{props.order.customer.address.street} ({props.order.customer.address.homeType})</div>
                                                <div>{props.order.customer.address.floor}. sprat ({props.order.customer.address.elevator?'ima lift':'nema lift'})</div>
                                            </>}
                                        </>}
                                    </MobileView>
                                </SkeletonRow>
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel key={'info'} header={'Informacije'}>
                            <Card>
                                <SkeletonRow loading={props.loading}>
                                <BrowserView viewClassName="w-100">
                                    {!props.loading && <Row>
                                        <Col span={5}>
                                            <Title level={5} className="pb-0 mb-0" type={'secondary'}>Ukupan iznos</Title>
                                            <Title level={4} className="mt-1">{props.order.totalAmount} RSD</Title>
                                        </Col>
                                        <Col span={5}>
                                            <Title level={5} className="pb-0 mb-0" type={'secondary'}>Avans</Title>
                                            <Title level={4} className="mt-1">{props.versions[version].data.orderInfo.avans} RSD</Title>
                                        </Col>
                                        <Col span={6}>
                                            <div>Popust: {props.versions[version].data.orderInfo.discount}%</div>
                                            <div>Rok isporuke: {props.versions[version].data.orderInfo.deadlineFrom} - {props.versions[version].data.orderInfo.deadlineTo} dana.</div>
                                            <div>Nacin placanja: {props.versions[version].data.orderInfo.paymentType}</div>
                                        </Col>
                                        </Row>}
                                </BrowserView>
                                <MobileView>
                                    {!props.loading && <>
                                        <div>
                                            <Title level={5} className="pb-0 mb-0" type={'secondary'}>Ukupan iznos</Title>
                                            <div>
                                                <Title level={4} className="mt-1">{props.order.totalAmount} RSD</Title>
                                            </div>
                                        </div>
                                        <div>
                                            <Title level={5} className="pb-0 mb-0" type={'secondary'}>Avans</Title>
                                            <div>
                                                <Title level={4} className="mt-1">{props.versions[version].data.orderInfo.avans} RSD</Title>
                                            </div>
                                        </div>
                                        <Row>
                                            <div>Popust: {props.versions[version].data.orderInfo.discount}%</div>
                                            <div>Rok isporuke: {props.versions[version].data.orderInfo.deadlineFrom} - {props.versions[version].data.orderInfo.deadlineTo} dana.</div>
                                            <div>Nacin placanja: Gotovina</div>
                                        </Row>
                                        </>}
                                </MobileView>
                                </SkeletonRow>
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel className="mb-3" key={'articles'} header={'Artikli'}>
                            <List
                                header={<div>
                                    {isBrowser && <Row className="w-100">
                                        <Col span={4}>
                                            <b>Naziv</b>
                                        </Col>
                                        <Col span={8}>
                                            <b>Opis</b>
                                        </Col>
                                        <Col span={8}>
                                            <b>Materijali</b>
                                        </Col>
                                        <Col span={1}>
                                            <b>Kol.</b>
                                        </Col>
                                        <Col span={3}>
                                            <b>Cena</b>
                                        </Col>
                                </Row>}</div>}
                                dataSource={props.loading?[]:props.versions[version].data.articles}
                                renderItem={(item, index) => 
                                <Row className="w-100 mt-1" align={'middle'}>
                                    <BrowserView viewClassName="w-100">
                                        <Row>
                                            <Col span={4}>
                                                {item.name}
                                            </Col>
                                            <Col span={8} style={{whiteSpace:'pre'}}>
                                                {item.description}
                                            </Col>
                                            <Col span={8}>
                                                {item.materials?item.materials.map(material=><>
                                                    <div>{material.description}</div>
                                                    <div><i>{material.name} ({material.producer})</i></div>
                                                </>):"Nema materijala"}
                                            </Col>
                                            <Col span={1}>
                                                {item.quantity}
                                            </Col>
                                            <Col span={3}>
                                                {item.price}
                                            </Col>
                                        </Row>
                                    </BrowserView>
                                    <MobileView viewClassName="w-100">
                                        <div><b>#{index + 1}</b></div>
                                        <div className="mt-0 mb-1">
                                            <div><b>Naziv</b></div>
                                            <div>{item.name}</div>
                                        </div>
                                        <div className="mt-0 mb-1" style={{whiteSpace:'pre'}}>
                                            <div><b>Opis</b></div>
                                            <div>{item.description}</div>
                                        </div>
                                        <div className="mt-0 mb-1">
                                            <div><b>Materijali</b></div>
                                            <div>{item.materials?item.materials.map(material=><>
                                                    <div>{material.description}</div>
                                                    <div><i>{material.name} ({material.producer})</i></div>
                                            </>):"Nema materijala"}</div>
                                        </div>
                                        <div>
                                            <div><b>Cena</b></div>
                                            <div>{item.quantity} x {item.price} RSD  {item.discount?("(-" + item.discount + "%)"):""} =</div>
                                            <div>{item.quantity * item.price * (item.discount?(100-item.discount)/100:0)} RSD</div>
                                        </div>
                                        {index !== (props.versions[version].data.articles.length - 1) ? <Divider className="w-100"/> : <></>}
                                    </MobileView>
                                </Row>}>
                            </List>
                        </Collapse.Panel>
                    </Collapse>
            </Card>

                </Col>
                {isBrowser && <Col className="p-4 bg-light" span={6}>
                    {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                </Col>}
            </Row>
            </Spin>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    versions: getOrderPreviewVersions(state),
    visible: isOrderPreviewVisible(state),
    order: getOrderPreviewData(state),
    loading: isOrderPreviewLoading(state),
    orderIndex: getOrderPreviewIndex(state),
    isAdmin: isAdmin(state)
})

export default connect(mapStateToProps)(OrderPreview);
