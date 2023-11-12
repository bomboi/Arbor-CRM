import React, { useRef, useState } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Divider, message } from 'antd';

import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { getAddedArticles } from '@selectors/ordersSelectors';
import { getNewOrderCustomer, usingDelivery, getOrderInfo, getDeliveryPrice, getAvans, getGlobalDiscount, getOrderPreviewData, getOrderPreviewVersions } from '../../../Redux/selectors/ordersSelectors';
import { getOrderDefaults } from '../../../Redux/selectors/appSelectors';
import moment from 'moment';
import Axios from 'axios';

class ComponentToPrint extends React.Component {


    render() {

        const calculateTotalPrice = (acc, value) => Number(acc) + Number(value.price) * Number(value.quantity) * (100 - Number(value.discount)) / 100;

        let amount = this.props.articles.reduce(calculateTotalPrice, [0]);
        let deliveryCondition = this.props.usingDelivery && this.props.deliveryPrice!==undefined && this.props.deliveryPrice !== '';
        // amount += (deliveryCondition?this.props.deliveryPrice:0);
        let avans = this.props.avans === undefined ? 0 : this.props.avans;
        let globalDiscount = this.props.globalDiscount === 0 ? '' : (' (-' + this.props.globalDiscount + '%)'); 
        let finalAmount = amount*(100 - this.props.globalDiscount)/100;
        return (
            !this.props.show?
            <></>
            :
            <div className="d-flex flex-column justify-content-between mt-0" style={{height: '100%'}}>
                <div className="d-flex flex-column justify-content-start">
                    <div className="bg-light">
                        <div className="d-flex justify-content-between header-margin">
                            <img className="order-logo" alt="arbor_logo" src={window.location.origin + '/logo.png'}/>
                            <div className="d-flex flex-column justify-content-start">
                                <div className="invoice-title text-secondary" style={{textAlign: 'right'}}>PREDRAČUN</div>
                                <div className="text-secondary" style={{whiteSpace:'pre', textAlign: 'right'}}>{this.props.defaults.DefaultCompanyInfo}</div>
                            </div>
                        </div>
                    </div>
                    <div className="content-margin">
                        <div className="customer-details d-flex justify-content-between align-items-start mt-4">
                            <div>
                                <div className="customer-name">
                                    <b>{this.props.customer.name}</b>
                                </div>
                                <div>
                                    Telefon: {this.props.customer.phone}
                                </div>
                                <div>
                                    {this.props.customer.email && <>Email: {this.props.customer.email}</>}
                                </div>
                                {this.props.usingDelivery &&
                                    <div>
                                    Adresa: {this.props.customer.address?.street} ({this.props.customer.address?.homeType}) / {this.props.customer.address?.floor}. sprat ({this.props.customer.address?.elevator?"ima lift":"nema lift"})
                                    </div>
                                }
                            </div>
                            <div>
                                {this.props.orderId && <div className="customer-name text-right">
                                    <b>#{this.props.orderId}</b>
                                </div>}
                                <div className="text-right">Datum: {moment(this.props.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                                <div>Način plaćanja: {this.props.orderInfo.paymentType}</div>
                            </div>
                        </div>
                        <Row gutter={20} className="mt-5 mb-0">
                            <Col span={4} className="pb-2 pt-2"><b>Naziv proizvoda</b></Col>
                            <Col span={12} className="pb-2 pt-2"><b>Opis</b></Col>
                            <Col span={4} className="pb-2 pt-2 text-right"><b>Cena</b></Col>
                            <Col span={4} className="pb-2 pt-2 text-right"><b>Ukupna cena</b></Col>
                        </Row>
                        <Divider className="mt-0 mb-0"/>
                        {this.props.articles.map((article, index) => (
                            <div className="m-0">
                            <Row className="mt-0" gutter={20}>
                                <Col span={4} className="pb-2 pt-2" style={{whiteSpace:'pre-wrap'}}>{article.name}</Col>
                                <Col span={12} className="pt-2 pb-2">
                                    <Row>
                                        <Col style={{whiteSpace:'pre'}}>
                                            {article.description}
                                        </Col>
                                    </Row>
                                    <Row className="mt-2"><b>Materijal</b></Row>
                                    <Divider className="mt-1 mb-1"/>
                                    <Row>
                                        <div>
                                            {article.materials.map(material => 
                                            <div>
                                                <i>{material.name} ({material.producer})</i> - {material.description}
                                            </div>)}
                                        </div>
                                    </Row>
                                    {!article.note ? <></>:<>
                                        <Row className="mt-2"><b>Napomena</b></Row>
                                        <Divider className="mt-1 mb-1"/>
                                        <Row>
                                            {article.note}
                                        </Row>
                                    </>
                                    }
                                </Col>
                                <Col className="pb-2 pt-2 text-right" span={4}>
                                    <div>
                                        {article.price} RSD x {article.quantity}
                                    </div>
                                    {article.discount === 0 ?<></>:  <div>- {article.discount}%</div>}
                                </Col>
                                <Col className="pb-2 pt-2 text-right" span={4}>{article.price * article.quantity * (100 - article.discount)/100} RSD</Col>
                            </Row>
                            {index !== (this.props.articles.length - 1) && <Divider className="mt-0 mb-0"/>}
                            </div>))}
                        <Divider className="mt-0 mb-0"/>
                        <Row className="mt-3">
                            <Col offset={17} span={3} className=" p-1 total-text-small">UKUPNO</Col>
                            <Col span={4} className="p-2 text-right total-text-small">{amount} RSD</Col>
                        </Row>
                        {this.props.orderInfo.discount != 0 && <Row>
                            <Col offset={17} span={3} className=" p-1 total-text-small">POPUST</Col>
                            <Col span={4} className="p-2 text-right total-text-small">- {this.props.orderInfo.discount} %</Col>
                        </Row>}
                        {this.props.usingDelivery &&
                        <Row className="">
                            <Col offset={17} span={3} className=" p-1 total-text-small">MONTAŽA</Col>
                            <Col span={4} className="p-2 text-right total-text-small">{this.props.deliveryPrice} RSD</Col>
                        </Row>
                        }
                        <Row className="">
                            <Col offset={17} span={3} className=" p-1 total-text-small">AVANS</Col>
                            <Col span={4} className="p-2 text-right total-text-small">{this.props.avans} RSD</Col>
                        </Row>
                        <Row className="">
                            <Col offset={16} span={8} className=" p-0 total-text-small"><Divider className="mt-2 mb-2"/></Col>
                        </Row>
                        
                        <Row className="">
                            <Col offset={16} span={3} className=" p-2 total-text">PREOSTALO</Col>
                            <Col span={5} className="p-2 text-right total-text">{Number(amount)*(100 - this.props.orderInfo.discount)/100 + (this.props.deliveryPrice?Number(this.props.deliveryPrice):0) - Number(this.props.avans) } RSD</Col>
                        </Row>
                    </div>
                </div>
                <div className="bg-light">
                    <Row className="footer-margin" justify={'center'}>
                        <p className="text-secondary mt-2 mb-0" level={2}>Rok isporuke je od {this.props.orderInfo.deadlineFrom} do {this.props.orderInfo.deadlineTo} dana.</p>
                        <p className="text-secondary mt-0 mb-3" level={2}>{this.props.defaults.DefaultOrderNote}</p>
                    </Row>
                </div>
            </div>
        );
    }
}

const mapStateToPropsPreview = (state, props) => {
    console.log(getOrderPreviewData(state));
    let listOfVersions = getOrderPreviewVersions(state);
    if(getOrderPreviewData(state)){
        console.log(listOfVersions[listOfVersions.length-1])
        return {
            orderId: getOrderPreviewData(state).orderId,
            articles: listOfVersions[listOfVersions.length-1].data.articles,
            customer: getOrderPreviewData(state).customer,
            usingDelivery: usingDelivery(state),
            defaults: getOrderDefaults(state),
            avans: getAvans(state),
            globalDiscount: getGlobalDiscount(state),
            orderInfo: listOfVersions[listOfVersions.length-1].data.orderInfo,
        }
    }
    else return {}
}

export const OrderInvoicePreviewPDF = connect(mapStateToPropsPreview)((props) => {

    const componentRef = useRef();
    let [show, setShow] = useState(false)

    return (
        <div className="d-inline">
            <ReactToPrint
                content={() => componentRef.current}
                onBeforeGetContent={()=>setShow(true)}
                onAfterPrint={()=>setShow(false)}>
                <PrintContextConsumer>
                    {({ handlePrint }) => (
                        <Button onClick={() => {
                            if(props.check()) {
                                setShow(true);
                                setTimeout(()=> handlePrint(), 5)
                            }
                            else {
                                message.error('Niste uneli sve potrebne podatke!')
                            }
                        }}>Štampaj</Button>
                    )}
                </PrintContextConsumer>
            </ReactToPrint>
            <div style={{ display: "none" }}>
                <ComponentToPrint  
                    orderId={props.orderId}
                    show={show}
                    articles={props.articles} 
                    customer={props.customer}
                    usingDelivery={props.usingDelivery}
                    defaults={props.defaults}
                    orderInfo={props.orderInfo}
                    deliveryPrice={props.deliveryPrice}
                    avans={props.avans}
                    globalDiscount={props.globalDiscount}
                    ref={componentRef} />
            </div>
        </div>
    )
})

const mapStateToProps = (state) => ({
    articles: getAddedArticles(state),
    customer: getNewOrderCustomer(state),
    usingDelivery: usingDelivery(state),
    defaults: getOrderDefaults(state),
    orderInfo: getOrderInfo(state),
    deliveryPrice: getDeliveryPrice(state),
    avans: getAvans(state),
    globalDiscount: getGlobalDiscount(state),
})

export const OrderInvoicePDF = connect(mapStateToProps)((props) => {

    const componentRef = useRef();
    let [show, setShow] = useState(false)

    return (
        <div className="d-inline">
            <ReactToPrint
                content={() => componentRef.current}
                onBeforeGetContent={()=>setShow(true)}
                onAfterPrint={()=>setShow(false)}>
                <PrintContextConsumer>
                    {({ handlePrint }) => (
                        <Button onClick={() => {
                            if(props.check()) {
                                setShow(true);
                                setTimeout(()=> handlePrint(), 5)
                            }
                            else {
                                message.error('Niste uneli sve potrebne podatke!')
                            }
                        }}>Štampaj</Button>
                    )}
                </PrintContextConsumer>
            </ReactToPrint>
            <div style={{ display: "none" }}>
                <ComponentToPrint  
                    orderId={props.orderId}
                    show={show}
                    articles={props.articles} 
                    customer={props.customer}
                    usingDelivery={props.usingDelivery}
                    defaults={props.defaults}
                    orderInfo={props.orderInfo}
                    deliveryPrice={props.deliveryPrice}
                    avans={props.avans}
                    globalDiscount={props.globalDiscount}
                    ref={componentRef} />
            </div>
        </div>
    )
})

export const OrderInvoiceSavePDF = connect(mapStateToProps)((props) => {

    const componentRef = useRef();
    let [show, setShow] = useState(false);
    let [orderId, setOrderId] = useState(props.orderId);

    return (
        <div className="d-inline">
            <ReactToPrint
                content={() => componentRef.current}
                onBeforeGetContent={()=>setShow(true)}
                onAfterPrint={()=>{setShow(false); props.afterPrint();}}>
                <PrintContextConsumer>
                    {({ handlePrint }) => (
                        <Button type="primary" onClick={() => {
                            props.save((returnedOrderId) => {
                                setOrderId(returnedOrderId);
                                setShow(true);
                                setTimeout(()=> handlePrint(), 5)
                            }, true);
                        }}>Sačuvaj i štampaj</Button>
                    )}
                </PrintContextConsumer>
            </ReactToPrint>
            <div style={{ display: "none" }}>
                <ComponentToPrint  
                    orderId={orderId}
                    show={show}
                    articles={props.articles} 
                    customer={props.customer}
                    usingDelivery={props.usingDelivery}
                    defaults={props.defaults}
                    orderInfo={props.orderInfo}
                    deliveryPrice={props.deliveryPrice}
                    avans={props.avans}
                    globalDiscount={props.globalDiscount}
                    ref={componentRef} />
            </div>
        </div>
    )
})



export default connect(mapStateToProps)(OrderInvoicePDF)