import React, { useState } from 'react'
import { Button, Row, Col, Input, Card, AutoComplete, Typography, Divider, PageHeader, InputNumber } from 'antd';
import Label from '../../../components/Label';
import { collect } from 'react-recollect';
import Axios from 'axios';
import AddMaterials from './AddMaterials';
import { AddArticleStore } from '../../stores';

const { TextArea } = Input;
const { Title } = Typography;

{/* <CheckCircleTwoTone twoToneColor="#52c41a" /> */}

const AddArticle = (props) => {

    let current = props.store.pages.orders.orderDetails.addArticle.current;
    let articles = props.store.pages.orders.orderDetails.articles;

    const store = AddArticleStore(props);

    let [article, setArticle] = useState({quantity: 1, discount: 0});
    let [subtitle, setSubtitle] = useState();

    const updateNumber = (e , key) => {
        const value = e;
        let tempArticle = article;
        tempArticle[key] = value;
        setArticle(article=>({...article, [key]:value}));
        console.log(article);
    }

    const update = (e , key) => {
        const value = e.target.value;
        let tempArticle = article;
        tempArticle[key] = value;
        setArticle(tempArticle);
        console.log(article);
    }

    const isArticleOk = () => {
        if(article.name == undefined) return false;
        if(article.description == undefined) return false;
        if(article.price == undefined) return false;
        // if(current.materials == undefined || current.materials.length == 0) return false;
        return true;
    }

    const addToStore = () => {
        if(isArticleOk()) {
            articles.push({...article, materials: current.materials})
            console.log('Articles');
            console.log(articles)
            store.current.materials = [];
            current = {}
            setArticle({quantity: 1, discount: 0})
            setSubtitle('')
        }
        else {
            setSubtitle('Niste uneli sva potrebna polja!')
        }
    }

    return (
        <Card className='mb-3'>
            <PageHeader
                ghost={true}
                title="Artikl"
                subTitle={subtitle}
                className="p-0"
                extra={[
                    <Button key="1">Cenovnik</Button>,
                    <Button key="2" onClick={addToStore} type="primary">Dodaj u porudzbinu</Button>,
                ]}/>
            {/* <Descriptions title="Artikl"/> */}
            <Divider orientation="left">Opis</Divider>
            <Row gutter={[20,10]}>
                <Col span={8}>
                    <Label text={'Ime proizvoda'}/>
                    <TextArea 
                        placeholder="Ime proizvoda" 
                        value={article.name}
                        autoSize 
                        onChange={e=>update(e, 'name')} />
                </Col>
                <Col span={16}>
                    <Label text={'Opis'}/>
                    <TextArea 
                        placeholder="Opis" 
                        value={article.description}
                        autoSize 
                        onChange={e=>update(e, 'description')}/>
                </Col>
            </Row>
            <AddMaterials/>
            <Divider className='mb-4'/>
            <Row gutter={[20,10]}>
                <Col span={8}>
                    <Label text={'Kolicina'}/>
                    <InputNumber 
                        className="w-100" 
                        placeholder="Kolicina"
                        value={article.quantity}
                        autoSize 
                        onChange={e=>updateNumber(e, 'quantity')}/>
                </Col>
                <Col span={8}>
                    <Label text={'Cena'}/>
                    <InputNumber 
                        className="w-100" 
                        placeholder="Cena" 
                        value={article.price}
                        step={0.2}
                        autoSize 
                        onChange={e=>updateNumber(e, 'price')}/>
                </Col>
                <Col span={8}>
                    <Label text={'Popust'}/>
                    <InputNumber 
                        formatter={value => `${value}%`} 
                        parser={value => value.replace('%', '')}
                        value={article.discount}
                        className="w-100" 
                        placeholder="Popust"
                        autoSize 
                        onChange={e=>updateNumber(e, 'discount')}/>
                </Col>
            </Row>

        </Card>
    )
}

export default collect(AddArticle)
