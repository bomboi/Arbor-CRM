import React, { useState } from 'react'
import { Button, Row, Col, Card, List } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { connect } from 'react-redux';
import { getAddedArticles, getAvans, getGlobalDiscount } from '@selectors/ordersSelectors';
import { newOrderArticlesSlice } from '../../../Redux/reducers/ordersReducers';
import Title from 'antd/lib/typography/Title';
import Paragraph from 'antd/lib/typography/Paragraph';


const ArticlesList = (props) => {
    
    const removeArticle = (index) => {
        props.dispatch(newOrderArticlesSlice.actions.removeArticle(index));
    }

    const calculateTotalPrice = (acc, value) => Number(acc) + Number(value.price) * Number(value.quantity) * (100 - Number(value.discount)) / 100;

    console.log(props.articles.reduce(calculateTotalPrice, [Number(0)]))

    let amount = props.articles.length === 0 ? 0 : props.articles.reduce(calculateTotalPrice, [0]);
    let avans = props.avans === undefined ? 0 : props.avans;
    let globalDiscount = props.globalDiscount === 0 ? '' : (' (-' + props.globalDiscount + '%)'); 
    let finalAmount = amount*(100-props.globalDiscount)/100;

    return (
        <Card className='mb-3'>
            <Title level={4}>Dodati artikli</Title>
            <Card>
                <Row>
                    <Col span={5}>
                        <Paragraph className='mb-0 pb-0' type={'secondary'} level={5}>Ukupan iznos</Paragraph>
                        <small><Paragraph className='mb-0 pb-0' type={'secondary'}>{amount} RSD {globalDiscount} = </Paragraph></small>
                        <Title className='mt-0' level={5}>{finalAmount} RSD</Title>
                    </Col>
                    <Col span={5}>
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
                            {item.materials?item.materials.map(material=>material.name):"Nema materijala"}
                        </Col>
                        <Col span={2}>
                            <Button onClick={()=>removeArticle(index)} icon={<DeleteOutlined />}/>
                        </Col>
                    </Row>
                </List.Item>
                )}
            />
            {/* {!store.articles?'':store.articles.map(article=>article.price)} */}
        </Card>
    )
}

const mapStateToProps = (state) => ({
    articles: getAddedArticles(state),
    avans: getAvans(state),
    globalDiscount: getGlobalDiscount(state)
})

export default connect(mapStateToProps)(ArticlesList)
