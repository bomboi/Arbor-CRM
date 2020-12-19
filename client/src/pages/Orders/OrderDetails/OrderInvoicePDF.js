import React, { useRef } from 'react'
import { connect } from 'react-redux'
import { Button, Row, Col, Divider } from 'antd';

import ReactToPrint from 'react-to-print';
import { getAddedArticles } from '@selectors/ordersSelectors';

class ComponentToPrint extends React.Component {

    render() {
        return (
            <div className="d-flex flex-column justify-content-between" style={{height: '100%'}}>
                <div className="content-margin">
                    <Row>
                        <div className="invoice-title">PREDRACUN</div>
                    </Row>
                    <div className="customer-details d-flex justify-content-between align-items-end">
                        <div>
                            <div className="customer-name">
                                Matija Bojovic
                            </div>
                            <div>
                                0605222023
                            </div>
                            <div>
                                matija7amg@gmail.com
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="">
                                Platana 3 (stan) 
                            </div>
                            <div>
                                3. sprat (nema lift)
                            </div>
                        </div>
                    </div>
                    <Row>
                        <Col span={4}>Naziv proizvoda</Col>
                        <Col span={5}>Opis</Col>
                        <Col span={5}>Materijali</Col>
                        <Col span={3}>Cena</Col>
                        <Col span={2}>Kolicina</Col>
                        <Col span={2}>Popust</Col>
                        <Col span={3}>Ukupna cena</Col>
                    </Row>
                    <Divider className="mt-2 mb-2"/>
                    {this.props.articles.map(article => (
                        <Row>
                            <Col span={4}>{article.name}</Col>
                            <Col span={10}>
                                <Row>
                                    <Col span={12} style={{whiteSpace:'pre'}}>{article.description}</Col>
                                    <Col span={12}>
                                        {article.materials.map(material => 
                                            <div>
                                                <div>
                                                    {material.description}
                                                </div>
                                                <div><i>
                                                    {material.name} / {material.producer}
                                                </i></div>
                                            </div>)}
                                    </Col>
                                </Row>
                                <Row>
                                    {article.note}
                                </Row>
                            </Col>
                            <Col span={3}>{article.price}</Col>
                            <Col span={2}>{article.quantity}</Col>
                            <Col span={2}>{article.discount}</Col>
                            <Col span={3}>{article.quantity}</Col>
                        </Row>))}
                </div>
                <div className="bg-light">
                    <Row className="footer-margin" justify={'center'}>
                        <p className="mt-2 mb-3" level={2}>Rok isporuke je od 30 do 40 dana.</p>
                    </Row>
                </div>
            </div>
        );
    }
}

export const OrderInvoicePDF = (props) => {

    const componentRef = useRef();

    return (
        <div className="d-inline">
            <ReactToPrint
                trigger={() => <Button>Stampaj</Button>}
                content={() => componentRef.current}
            />
            <div style={{ display: "none" }}>
                <ComponentToPrint articles={props.articles} ref={componentRef} />
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    articles: getAddedArticles(state)
})

export default connect(mapStateToProps)(OrderInvoicePDF)