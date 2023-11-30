import React, {useState} from 'react'
import { Modal, Row, Col, Button, Tag, Select, Spin, Skeleton } from 'antd';
import { Popup, Tabs, Card, ProgressBar, List, Divider, NoticeBar } from 'antd-mobile'
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { getTagColor } from '../../utils';
import OrderFactoryPDF from './OrderFactoryPDF';
import { OrderInvoicePDF, OrderInvoicePreviewPDF } from './OrderDetails/OrderInvoicePDF';
import moment from 'moment';

const OrderPreviewMobile = (props) => {

    return (
        props.order === undefined ? <></> :
        <Popup 
            showCloseButton
            visible={props.visible} 
            onClose={props.closePreview} 
            onMaskClick={props.closePreview}
            bodyStyle={{ height: '100vh' }}>
                <div className='bg-light h-100' >
                    <Tabs className='h-100'>
                        <Tabs.Tab title='Pregled' key='fruits' >
                            <div style={{height: '100%', overflowY: 'scroll' , margin:-12}} >
                            <Spin spinning={props.loading}>
                            {/* <Collapse ghost>
                                <Collapse.Panel header={'Opcije'}>
                                    <div className="pl-4 pr-4 pt-3 pb-3 d-flex flex-column">
                                    <Button onClick={props.deleteOrder} type={'primary'} className="mb-2" danger>Obrisi</Button>
                                    <Button onClick={} className="mb-2">Štampaj</Button>
                                    <OrderInvoicePreviewPDF check={() => true} orderId={props.order?props.order.orderId:0}/>
                                    {props.isAdmin && <OrderFactoryPDF className="mb-2 w-100" version={props.version}/>}
                                    <Button className="mb-2">Prijavi reklamaciju</Button>
                                    <Button className="mb-2" onClick={props.editOrder}>Izmeni</Button>
                                    </div>
                                </Collapse.Panel>
                            </Collapse> */}
                <Row>
                    <Col className="pb-4 pt-2" span={24}>
                        {props.loading? <Skeleton active paragraph={{rows:0}}/> :<>
                            <div className={"d-flex justify-content-between m-3"}>
                                <div className="text-secondary mt-0">
                                    <div>
                                        izdato od: {props.versions[0].changedBy.firstName} {props.versions[0].changedBy.lastName} 
                                    </div>
                                    <div>
                                        trenutna verzija: {props.versions[props.version].changedBy.firstName} {props.versions[props.version].changedBy.lastName} ({moment(props.versions[props.version].dateCreated).format('DD. MM. YYYY.').toString()})
                                    </div>
                                </div>
                                <div>
                                    <props.SelectVersion 
                                        onSelect={props.selectVersion}
                                        number={props.versions.length}/>
                                </div>
                            </div>
                            <div className="d-flex justify-content-between m-3">
                                <div className="d-flex align-items-end">
                                    <Title level={4} className="mb-0">#{props.order.orderId}</Title>
                                </div>
                                <div className="align-self-center">
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
                        {!props.loading && <>
                            <List header='Kupac' mode='card'>
                                <List.Item>
                                    <h5>{props.order.customer.name}</h5>
                                    <div>{props.order.customer.phone}</div>
                                    <div>{props.order.customer.email}</div>
                                </List.Item>
                            </List >
                            {props.versions[props.version].data.orderInfo.delivery &&
                                <List header='Adresa'  mode='card'>
                                <List.Item>
                                    <div>{props.order.customer.address.street} ({props.order.customer.address.homeType})</div>
                                    <div>{props.order.customer.address.floor}. sprat ({props.order.customer.address.elevator?'ima lift':'nema lift'})</div>
                                </List.Item>
                            </List>}
                            
                            <List header='Placanje'  mode='card'>
                                <List.Item>
                                    <div>Popust: {props.versions[props.version].data.orderInfo.discount}%</div>
                                    <div>Rok isporuke: {props.versions[props.version].data.orderInfo.deadlineFrom} - {props.versions[props.version].data.orderInfo.deadlineTo} dana.</div>
                                    <div>Nacin placanja: {props.versions[props.version].data.orderInfo.paymentType}</div>
                                    <div>Datum: {moment(props.versions[props.version].data.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                                    {props.versions[props.version].data.orderInfo.note && <div>Napomena: {props.versions[props.version].data.orderInfo.note}</div>}
                                </List.Item>
                                <List.Item>
                                    <ProgressBar percent={props.versions[props.version].data.orderInfo.avans / props.order.totalAmount * 100} />
                                    <div>{props.versions[props.version].data.orderInfo.avans} / {props.order.totalAmount} RSD</div>
                                </List.Item>
                            </List> 
                        </>}
                        <Divider>Aritkli</Divider>
                        {props.loading ? <></> : 
                            props.versions[props.version].data.articles.map((item, index) => 
                            <List mode='card'>
                                <List.Item>
                                    <div><b>#{index + 1} {item.name}</b></div>
                                    <div>{item.quantity} x {item.price} RSD  {item.discount?("(-" + item.discount + "%)"):""} = {item.quantity * item.price * (item.discount?(100-item.discount)/100:0)} RSD</div>
                                    </List.Item>
                                    <List.Item>
                                    <div style={{whiteSpace:'pre'}}>{item.description}</div>
                                    </List.Item>
                                    {item.materials ?
                                    item.materials.map(material=>
                                        <List.Item>
                                            <div>{material.description}</div>
                                            <div><i>{material.name} ({material.producer})</i></div>
                                        </List.Item>)
                                    :<></>}
                                    
                            </List>
                            )}
                    </Col>
                </Row>
                </Spin>

                            </div>
                    </Tabs.Tab>
                    <Tabs.Tab title='Komentari' key='vegetables'>
                        {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                    </Tabs.Tab>
                </Tabs>
                </div>
        </Popup>
    )
}

export default OrderPreviewMobile;
