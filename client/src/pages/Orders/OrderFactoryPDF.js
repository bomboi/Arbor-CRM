import React, { useRef, useState } from 'react'
import { connect } from 'react-redux';
import ReactToPrint, { PrintContextConsumer } from 'react-to-print';
import { Button, message, Row, Col, Divider } from 'antd';
import moment from 'moment';
import { usingDelivery, getOrderPreviewVersions, getOrderPreviewData } from '../../Redux/selectors/ordersSelectors';
import { getOrderDefaults } from '../../Redux/selectors/appSelectors';
import Axios from 'axios';

class ComponentToPrint extends React.Component {


    render() {
        return (
            !this.props.show?
            <></>
            :
            <div className="d-flex flex-column justify-content-between mt-0" style={{height: '100%'}}>
                <div className="d-flex flex-column justify-content-start big-font">
                    <div className="content-margin">
                        <div className="customer-details d-flex justify-content-between align-items-start mt-4">
                            <div>
                                {this.props.orderId && <div className="customer-name big-font">
                                    <b>#{this.props.orderId}</b>
                                </div>}
                                <div className="big-font">Datum: {moment(this.props.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                                <div className="customer-name big-font">
                                    <b>{this.props.customer.name}</b>
                                </div>
                                <div>
                                    Telefon: {this.props.customer.phone}
                                </div>
                                <div>
                                    {this.props.customer.email && <>Email: {this.props.customer.email}</>}
                                </div>
                                {this.props.usingDelivery &&<div>
                                    <div>
                                    Adresa: {this.props.customer.address.street} ({this.props.customer.address.homeType}) / {this.props.customer.address.floor}. sprat ({this.props.customer.address.elevator?"ima lift":"nema lift"})
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <Row gutter={20} className="mt-5 mb-0">
                            <Col span={6} className="pb-2 pt-2"><b>Naziv proizvoda</b></Col>
                            <Col span={18} className="pb-2 pt-2"><b>Opis</b></Col>
                        </Row>
                        <Divider className="mt-0 mb-0"/>
                        {this.props.articles.map((article, index) => (
                            <div className="m-0">
                            <Row className="mt-0" gutter={20}>
                                <Col span={6} className="pb-2 pt-2" style={{whiteSpace:'pre-wrap'}}>{article.name}</Col>
                                <Col span={18} className="pt-2 pb-2">
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
                            </Row>
                            {index !== (this.props.articles.length - 1) && <Divider className="mt-0 mb-0"/>}
                            </div>))}
                        <Divider className="mt-0 mb-0"/>
                    </div>
                </div>
                <div className="bg-light big-font">
                    <Row className="footer-margin" justify={'center'}>
                        <p className="text-secondary mt-2 mb-0" level={2}>Rok isporuke je od {this.props.orderInfo.deadlineFrom} do {this.props.orderInfo.deadlineTo} dana.</p>
                    </Row>
                </div>
            </div>
        );
    }
}

const ComponentToPrintM = (props) =>  {
        return (
            !props.show?
            <></>
            :
            <div className="d-flex flex-column justify-content-between mt-0 mb-3" style={{height: '100%', pageBreakAfter:'always'}}>
                <div className="d-flex flex-column justify-content-start big-font">
                    <div className="content-margin">
                        <div className="customer-details d-flex justify-content-between align-items-start mt-4">
                            <div>
                                {props.orderId && <div className="customer-name big-font">
                                    <b>#{props.orderId}</b>
                                </div>}
                                <div className="big-font">Datum: {moment(props.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                                <div className="customer-name big-font">
                                    <b>{props.customer.name}</b>
                                </div>
                                <div>
                                    Telefon: {props.customer.phone}
                                </div>
                                <div>
                                    {props.customer.email && <>Email: {props.customer.email}</>}
                                </div>
                                {props.usingDelivery &&<div>
                                    <div>
                                    Adresa: {props.customer.address.street} ({props.customer.address.homeType}) / {props.customer.address.floor}. sprat ({props.customer.address.elevator?"ima lift":"nema lift"})
                                    </div>
                                </div>}
                            </div>
                        </div>
                        <Row gutter={20} className="mt-5 mb-0">
                            <Col span={6} className="pb-2 pt-2"><b>Naziv proizvoda</b></Col>
                            <Col span={18} className="pb-2 pt-2"><b>Opis</b></Col>
                        </Row>
                        <Divider className="mt-0 mb-0"/>
                        {props.articles.map((article, index) => (
                            <div className="m-0">
                            <Row className="mt-0" gutter={20}>
                                <Col span={6} className="pb-2 pt-2" style={{whiteSpace:'pre-wrap'}}>{article.name}</Col>
                                <Col span={18} className="pt-2 pb-2">
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
                            </Row>
                            {index !== (props.articles.length - 1) && <Divider className="mt-0 mb-0"/>}
                            </div>))}
                        <Divider className="mt-0 mb-0"/>
                    </div>
                </div>
                <div className="bg-light big-font">
                    <Row className="footer-margin" justify={'center'}>
                        <p className="text-secondary mt-2 mb-0" level={2}>Rok isporuke je od {props.orderInfo.deadlineFrom} do {props.orderInfo.deadlineTo} dana.</p>
                    </Row>
                </div>
            </div>
        );
}

const cmpArrays = (arr1, arr2) => {
    if(arr1.length != arr2.length) return false;
    for(let a of arr1) {
        let ret = false;
        for(let b of arr2) {
            if(a === b) {
                ret = true;
                break;
            }
        }
        if(!ret) return false
    }
    return true;
}

class MultipleComponentsToPrint extends React.Component {
    
    componentDidUpdate(prevProps) {
        let orders = this.state.orders;
        if(!this.props.show && !cmpArrays(this.props.ids, prevProps.ids)) {
            console.log("Different ids!")
            let waitingQueueStarted = 0;
            let waitingQueueFinished = 0;
            this.props.ids.map((id, index) => {
                // Get new order if it is not already in the list
                if(!orders.some(item => item._id === id)) {
                    waitingQueueStarted++;
                    Axios.get('/api/order/get-versions', {params:{orderId:id}}).then(resVersions => {
                        Axios.get('/api/order/by-id/'+id).then(res => {
                            orders.push({
                                _id: res.data._id,
                                id: res.data.orderId,
                                articles:resVersions.data.orderVersions[res.data.latestVersion].data.articles,
                                customer:res.data.customer,
                                usingDelivery:resVersions.data.orderVersions[res.data.latestVersion].data.orderInfo.delivery,
                                orderInfo:resVersions.data.orderVersions[res.data.latestVersion].data.orderInfo, 
                            })

                            // If it is the last id, update state
                            if(index === this.props.ids.length - 1) {
                                // Remove unselected ids
                                waitingQueueFinished++;
                            }
                        })
                    })
                }

                // If it is the last id, update state
                if(index === this.props.ids.length - 1) {
                    // Poll if fetching data is finished
                    let interval = setInterval(() => {
                        if(waitingQueueStarted === waitingQueueFinished) {
                            clearInterval(interval);
                            orders = orders.filter(item => this.props.ids.includes(item._id));
                            console.log("ORDERS");
                            console.log(orders)
                            this.setState({orders:orders});
                            this.setState({loaded: true});
                        }
                    }, 10)
                }
            })
        }
    }

    state = {
        loaded: false, 
        orders: []
    }

    render() {
        // console.log('render loaded: ' + this.state.loaded)
        return !this.state.loaded ? <div></div> : <div >{this.state.orders.map(item =>{
            return <ComponentToPrintM 
                orderId={item.id}
                customer={item.customer}
                show={this.props.show}
                usingDelivery={item.usingDelivery}
                orderInfo={item.orderInfo}
                articles={item.articles}/>
        }
            )}</div>
    }

}

export const OrderFactoryPDFMultiple = (props) => {
    const componentRef = useRef();
    let [show, setShow] = useState(false)

    return (
    <div className={"d-inline "}>
        <ReactToPrint
            content={() => componentRef.current}
            onBeforeGetContent={()=>setShow(true)}
            onAfterPrint={()=>setShow(false)}>
            <PrintContextConsumer>
                {({ handlePrint }) => (
                    <Button className={props.className} onClick={() => {
                        console.log('PDF')
                        setShow(true);
                        setTimeout(()=> handlePrint(), 5)
                    }}>Štampaj selektovane naloge</Button>
                )}
            </PrintContextConsumer>
        </ReactToPrint>
        <div style={{ display: "none" }}>
            <MultipleComponentsToPrint  
                ids={props.ids}
                show={show}
                ref={componentRef} />
        </div>
    </div>)
}

const OrderFactoryPDF = (props) => {
    const componentRef = useRef();
    let [show, setShow] = useState(false)

    return (
        <div className={"d-inline "}>
            <ReactToPrint
                content={() => componentRef.current}
                onBeforeGetContent={()=>setShow(true)}
                onAfterPrint={()=>setShow(false)}>
                <PrintContextConsumer>
                    {({ handlePrint }) => (
                        <Button className={props.className} onClick={() => {
                            console.log('PDF')
                            setShow(true);
                            setTimeout(()=> handlePrint(), 5)
                        }}>Štampaj nalog</Button>
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
                    orderInfo={props.orderInfo}
                    ref={componentRef} />
            </div>
        </div>
    )
}

const mapStateToProps = (state, props) => {
    console.log(getOrderPreviewData(state))
    console.log(props.version)
    if(getOrderPreviewData(state) && getOrderPreviewVersions(state)[props.version] && props.version !== -1){
        console.log(getOrderPreviewVersions(state)[props.version])
        return {
            orderId: getOrderPreviewData(state).orderId,
            articles: getOrderPreviewVersions(state)[props.version].data.articles,
            customer: getOrderPreviewData(state).customer,
            usingDelivery: usingDelivery(state),
            orderInfo: getOrderPreviewVersions(state)[props.version].data.orderInfo,
        }
    }
    else return {}
}

export default connect(mapStateToProps)(OrderFactoryPDF);
