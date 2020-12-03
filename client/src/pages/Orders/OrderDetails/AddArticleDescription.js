import React from 'react'
import { Row, Col, InputNumber } from 'antd';
import Label from '../../../components/Label';
import TextArea from 'antd/lib/input/TextArea';
import { newOrderNewArticleSlice } from '@reducers/ordersReducers';
import { getNewOrderNewArticle } from '@selectors/ordersSelectors';
import { connect } from 'react-redux';

const AddArticleDescription = (props) => {
    
    const update = (value , key) => {
        props.dispatch(newOrderNewArticleSlice.actions.updateArticle({key, value}))
        console.log(props.article);
    }

    const isArticleOk = () => {
        if(props.article.name === undefined) return false;
        if(props.article.description === undefined) return false;
        if(props.article.price === undefined) return false;
        // if(current.materials == undefined || current.materials.length == 0) return false;
        return true;
    }

    return (
        <div>
            <Row gutter={[20,10]}>
                <Col span={8}>
                    <Label text={'Ime proizvoda'} required/>
                    <TextArea 
                        placeholder="Ime proizvoda" 
                        value={props.article.name}
                        autoSize 
                        onChange={e=>update(e.target.value, 'name')} />
                </Col>
                <Col span={16}>
                    <Label text={'Opis'}/>
                    <TextArea 
                        placeholder="Opis" 
                        value={props.article.description}
                        autoSize 
                        onChange={e=>update(e.target.value, 'description')}/>
                </Col>
            </Row>
            <Row gutter={[20,10]}>
                <Col span={8}>
                    <Label text={'Kolicina'} required/>
                    <InputNumber 
                        className="w-100" 
                        placeholder="Kolicina"
                        value={props.article.quantity}
                        autoSize 
                        onChange={value=>update(value, 'quantity')}/>
                </Col>
                <Col span={8}>
                    <Label text={'Cena'} required/>
                    <InputNumber 
                        className="w-100" 
                        placeholder="Cena" 
                        value={props.article.price}
                        step={0.2}
                        autoSize 
                        onChange={value=>update(value, 'price')}/>
                </Col>
                <Col span={8}>
                    <Label text={'Popust'}/>
                    <InputNumber 
                        formatter={value => `${value}%`} 
                        parser={value => value.replace('%', '')}
                        value={props.article.discount}
                        className="w-100" 
                        placeholder="Popust"
                        autoSize 
                        onChange={value=>update(value, 'discount')}/>
                </Col>
            </Row>
            <Row>
                <Label text={'Napomena'}/>
                <TextArea 
                    placeholder="Napomena" 
                    value={props.article.note}
                    autoSize 
                    onChange={e=>update(e.target.value, 'note')}/>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    article: getNewOrderNewArticle(state)    
})

export default connect(mapStateToProps)(AddArticleDescription)
