import React, { useState } from 'react'
import { Button, Row, Col, Card, List, PageHeader } from 'antd';
import { DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getAddedArticles, getAvans, getGlobalDiscount } from '@selectors/ordersSelectors';
import { newOrderArticlesSlice, newOrderNewArticleSlice } from '../../../Redux/reducers/ordersReducers';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';
import Modal from 'antd/lib/modal/Modal';
import AddArticleDescription from './AddArticleDescription';
import AddArticle from './AddArticle';
import { usingDelivery, getDeliveryPrice } from '../../../Redux/selectors/ordersSelectors';


const ArticlesList = (props) => {

    let [visible, setVisible] = useState(false);
    let [edit, setEdit] = useState(false);
    let [currentIndex, setCurrentIndex] = useState(0);
    
    const removeArticle = (index) => {
        props.dispatch(newOrderArticlesSlice.actions.removeArticle(index));
    }

    const editArticle = (index) => {
        setCurrentIndex(index);
        setEdit(true);
        props.dispatch(newOrderNewArticleSlice.actions.setArticle(props.articles[index]));
        setVisible(true);
    }

    const calculateTotalPrice = (acc, value) => Number(acc) + Number(value.price) * Number(value.quantity) * (100 - Number(value.discount)) / 100;

    let amount = props.articles.length === 0 ? 0 : props.articles.reduce(calculateTotalPrice, [0]);
    let deliveryCondition = props.hasDelivery && props.deliveryPrice!==undefined && props.deliveryPrice !== '';
    amount += (deliveryCondition?props.deliveryPrice:0);
    let avans = props.avans === undefined ? 0 : props.avans;
    let globalDiscount = props.globalDiscount === 0 ? '' : (' (-' + props.globalDiscount + '%)'); 
    let finalAmount = amount*(100-props.globalDiscount)/100;

    return (
        <Card className='mb-3'>
            <PageHeader
                ghost={true}
                title="Dodati artikli"
                className="p-0 pb-2 m-0"
                extra={[
                    <Button type={'primary'} onClick={()=>{ setVisible(true);}} key="1">Dodaj artikl</Button>,
                ]}/>
            <Card>
                <Row>
                    <Col span={6}>
                        <Paragraph className='mb-0 pb-0' type={'secondary'} level={5}>Ukupan iznos</Paragraph>
                        <small><Paragraph className='mb-0 pb-0' type={'secondary'}>{amount} RSD {globalDiscount} {deliveryCondition?(' + ' + props.deliveryPrice + ' RSD'):''}= </Paragraph></small>
                        <Title className='mt-0' level={5}>{finalAmount} RSD</Title>
                    </Col>
                    <Col span={6}>
                        <Paragraph className='mb-0 pb-0' type={'secondary'} level={5}>Preostali iznos</Paragraph>
                        <small><Paragraph className='mb-0 pb-0' type={'secondary'}>{finalAmount} RSD - {avans} RSD =</Paragraph></small>
                        <Title className='mt-0' level={5}>{finalAmount - avans} RSD</Title>
                    </Col>
                </Row>
            </Card>
            <List
                itemLayout="horizontal"
                locale={{ emptyText: 'Niste dodali nijedan artikl.' }}
                dataSource={props.articles}
                header={<Row className="w-100">
                        <Col span={4}>
                            <b>Naziv i cena</b>
                        </Col>
                        <Col span={9}>
                            <b>Opis</b>
                        </Col>
                        <Col span={9}>
                            <b>Materijali</b>
                        </Col>
                    </Row>}
                renderItem={(item, index) => (
                <List.Item key={item.price}> 
                    <Row className="w-100">
                        <Col span={4}>
                            <Row>{item.name}</Row>
                            <Row><small>{item.quantity} x {item.price} RSD {item.discount !== 0 ? (' (-'+item.discount + '%)'):''} </small></Row>
                            <Row><small><b>= {item.quantity*item.price*(100-item.discount)/100} RSD</b></small></Row>
                        </Col>
                        <Col span={9} style={{whiteSpace:'pre'}}>
                            {item.description}
                        </Col>
                        <Col span={9}>
                            {item.materials?
                                item.materials.map(material=><div>
                                    <div>{material.description}</div>
                                    <div><i><small>{material.name} / {material.producer}</small></i></div>
                                </div>)
                                :
                                "Nema materijala"}
                        </Col>
                        <Col span={2}>
                            <Button 
                                className="mr-1" 
                                onClick={()=>editArticle(index)}
                                 icon={<EditOutlined />}/>
                            <Button onClick={()=>removeArticle(index)} icon={<DeleteOutlined />}/>
                        </Col>
                    </Row>
                </List.Item>
                )}
            />
            <AddArticle index={currentIndex} visible={visible} onCancel={()=>setVisible(false)} edit={edit}/>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    articles: getAddedArticles(state),
    avans: getAvans(state),
    globalDiscount: getGlobalDiscount(state),
    hasDelivery: usingDelivery(state),
    deliveryPrice: getDeliveryPrice(state)
})

export default connect(mapStateToProps)(ArticlesList)
