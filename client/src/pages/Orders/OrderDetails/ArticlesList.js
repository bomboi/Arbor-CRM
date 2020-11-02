import React from 'react'
import { Button, Row, Col, Input, InputNumber, Checkbox, Card, Descriptions, Typography, Divider, List, Empty } from 'antd';
import Label from '../../../components/Label';
import { collect } from 'react-recollect'
import { DeleteOutlined } from '@ant-design/icons';

const { TextArea } = Input;
const { Title } = Typography;

const ArticlesList = (props) => {
    
    let store = props.store.pages.orders.orderDetails;
    
    const removeArticle = (index) => {
        store.articles.splice(index, 1);
    }

    return (
        <Card className='mb-3'>
            <Descriptions title="Dodati artikli"/>
            <List
                itemLayout="horizontal"
                locale={{ emptyText: 'Niste dodali nijedan artikl' }}
                dataSource={store.articles}
                header={<Row className="w-100">
                        <Col span={6}>
                            <b>Naziv i cena</b>
                        </Col>
                        <Col span={8}>
                            <b>Opis</b>
                        </Col>
                        <Col span={8}>
                            <b>Materijali</b>
                        </Col>
                    </Row>}
                renderItem={(item, index) => (
                <List.Item key={item.price}> 
                    <Row className="w-100">
                        <Col span={6}>
                            <Row>{item.name}</Row>
                            <Row>{item.quantity} x {item.price}</Row>
                            <Row>= {item.quantity*item.price}</Row>
                        </Col>
                        <Col span={8}>
                            {item.description}
                        </Col>
                        <Col span={8}>
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

export default collect(ArticlesList)
