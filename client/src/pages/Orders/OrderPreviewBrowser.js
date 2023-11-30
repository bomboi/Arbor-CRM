import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Input, Divider, Button, Card, Tag, List, Select, Spin, Skeleton, Progress } from 'antd';
import { red, green } from '@ant-design/colors';
import { 
    isOrderPreviewVisible, 
    getOrderPreviewData, 
    getOrderPreviewVersions, 
    isOrderPreviewLoading, 
    getOrderPreviewIndex 
} from '@selectors/ordersSelectors';
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { isAdmin } from '@selectors/appSelectors';
import { getTagColor } from '../../utils';
import OrderFactoryPDF from './OrderFactoryPDF';
import { OrderInvoicePDF, OrderInvoicePreviewPDF } from './OrderDetails/OrderInvoicePDF';
import moment from 'moment';

const OrderPreviewBrowser = (props) => {

    return (
        props.order === undefined ? <></> :
        <Modal 
            bodyStyle={{padding: 0}}
            zIndex={5}
            width={1200}
            centered
            footer={null}
            visible={props.visible}
            closable = {false}>
            <Spin spinning={props.loading}>
            <Row justify={'space-between'} className="pl-4 pr-4 pt-3 pb-3">
                <div>
                    {props.isAdmin && <Button onClick={props.deleteOrder} type={'primary'} className="mr-2" danger>Obrisi</Button>}
                    <OrderInvoicePreviewPDF check={() => true} orderId={props.order?props.order.orderId:0}/>
                    {props.isAdmin && <OrderFactoryPDF version={props.version}/>}
                    <Button onClick={props.complaint} className="mr-2">Prijavi reklamaciju</Button>
                    <Button onClick={props.editOrder}>Izmeni</Button>
                </div>
                <Button onClick={props.closePreview}>
                    Zatvori</Button>
            </Row>
            <Divider className="m-0"/>
            <Row>
                <Col className="pl-4 pr-4 pb-4 pt-2" span={18}>
                    {props.loading? <Skeleton active paragraph={{rows:0}}/> :<>
                        <div className="d-flex justify-content-between">
                            <small className="text-secondary mt-0">
                                <div>
                                    izdato od: {props.versions[0].changedBy.firstName} {props.versions[0].changedBy.lastName} 
                                </div>
                                <div>
                                    trenutna verzija: {props.versions[props.version].changedBy.firstName} {props.versions[props.version].changedBy.lastName} ({moment(props.versions[props.version].dateCreated).format('DD. MM. YYYY.').toString()})
                                </div>
                            </small>
                        </div>
                        <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex align-items-end">
                                <Title level={4} className="mb-0">#{props.order.orderId}</Title>
                            </div>
                            <div className="align-self-center">
                                <props.SelectVersion 
                                    onSelect={props.selectVersion}
                                    number={props.versions.length}/>
                                {!props.isAdmin ? 
                                <Tag color={'blue'} style={{fontSize:14}} className="mr-0">
                                    {props.order.state.toUpperCase()}
                                </Tag>
                                :
                                <Select 
                                    bordered={false} 
                                    value={props.firstState.toUpperCase()} 
                                    className={"ant-tag ant-tag-" + getTagColor(props.firstState)}
                                    onSelect={props.onSelectOrderState}>
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
            <props.SkeletonRow loading={props.loading}>
                {!props.loading && <>
                <Card className='w-100 mb-2'>
                <Row className='text-secondary'>
                    <Col span={9} className='pr-2'>
                        <Title level={4} className="mb-1">{props.order.customer.name}</Title>
                        <div>{props.order.customer.phone}</div>
                        <div>{props.order.customer.email}</div>
                    </Col>
                    {props.versions[props.version].data.orderInfo.delivery &&
                        <Col span={9} className='pr-2 pl-2'>
                            <div>{props.order.customer.address.street} ({props.order.customer.address.homeType})</div>
                            <div>{props.order.customer.address.floor}. sprat ({props.order.customer.address.elevator?'ima lift':'nema lift'})</div>
                        </Col>}
                    <Col span={6} className='pl-2'>
                        <div>Popust: {props.versions[props.version].data.orderInfo.discount}%</div>
                        <div>Rok isporuke: {props.versions[props.version].data.orderInfo.deadlineFrom} - {props.versions[props.version].data.orderInfo.deadlineTo} dana.</div>
                        <div>Nacin placanja: {props.versions[props.version].data.orderInfo.paymentType}</div>
                        <div>Datum: {moment(props.versions[props.version].data.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                        {props.versions[props.version].data.orderInfo.note && <div>Napomena: {props.versions[props.version].data.orderInfo.note}</div>}
                        <Progress
                            className='w-80'
                            type='line'
                            trailColor='#d9dcde'
                            showInfo={false}
                            percent={props.versions[props.version].data.orderInfo.avans / props.order.totalAmount * 100} />
                        <div>{props.versions[props.version].data.orderInfo.avans} / {props.order.totalAmount} RSD</div>
                    </Col>
                </Row>
                </Card>
                </>}
            </props.SkeletonRow>
            <Card bodyStyle={{overflowY:'scroll', height:320}}>
                <List
                    header={<Row className="w-100">
                            <Col span={4}>
                                <b>Naziv</b>
                            </Col>
                            <Col span={9}>
                                <b>Opis</b>
                            </Col>
                            <Col span={6}>
                                <b>Materijali</b>
                            </Col>
                            <Col span={2}>
                                <b>Kol.</b>
                            </Col>
                            <Col span={3}>
                                <b>Cena</b>
                            </Col>
                    </Row>}
                    dataSource={props.loading?[]:props.versions[props.version].data.articles}
                    renderItem={(item, index) => 
                        <List.Item>
                            <Row className="w-100">
                                <Col span={4} className='pr-2'>
                                    {item.name}
                                </Col>
                                <Col span={9} style={{whiteSpace:'pre'}} className='pl-2 pr-2'>
                                    {item.description}
                                </Col>
                                <Col span={6} className='pl-2 pr-2'>
                                    {item.materials?item.materials.map(material=><>
                                        <div>{material.description}</div>
                                        <div><i>{material.name} ({material.producer})</i></div>
                                    </>):"Nema materijala"}
                                </Col>
                                <Col span={2} className='pl-2 pr-2'>
                                    {item.quantity}
                                </Col>
                                <Col span={3} className='pl-2'>
                                    {item.price}
                                </Col>
                            </Row>
                        </List.Item>
                }>
                </List>
            </Card>

                </Col>
                <Col className="p-4 bg-light" span={6}>
                    {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                </Col>
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

export default OrderPreviewBrowser;
