import React, { useState } from 'react'
import { Button, Row, Col, Input, AutoComplete, List, message } from 'antd';
import Label from '../../../components/Label';
import {
    SaveOutlined, DeleteOutlined
  } from '@ant-design/icons';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getCurrentMaterial, getArticleMaterials } from '@selectors/ordersSelectors';
import { newOrderNewArticleSlice } from '@reducers/ordersReducers';

const { TextArea } = Input;

const AddMaterials = (props) => {

    let [producerOptions, setProducerOptions] = useState([])
    let [nameOptions, setNameOptions] = useState([])

    const addMaterial = () => {
        props.dispatch(newOrderNewArticleSlice.actions.addMaterial());
    }

    const removeMaterial = (index) => {
        props.dispatch(newOrderNewArticleSlice.actions.removeMaterial(index));
    }


    const producerSearch = (value) => {
        Axios({
            url:'/api/material/producers', 
            method: 'GET',
            params: { value }
        })
        .then((res)=>{
            console.log(res.data)
            setProducerOptions(res.data.map(r => { return { label:r, value:r }; } ));
        })
    }

    const update = (value, key) => {
        props.dispatch(newOrderNewArticleSlice.actions.updateCurrentMaterial({key, value}))
    }

    const saveProducer = () => {
        console.log('saveProducer')
        Axios({
            url:'/api/material/producers/save', 
            method: 'POST',
            data: { value: props.currentMaterial.producer }
        })
        .then((res)=>{
            console.log(res)
            message.success('Sačuvan proizvođač');
        })
    }

    const nameSearch = (value) => {
        Axios({
            url:'/api/material/names', 
            method: 'GET',
            params: { name: value, producer: props.currentMaterial.producer }
        })
        .then((res)=>{
            console.log('Names')
            setNameOptions(res.data.reduce((acc, d)=>acc.concat(d.names.map(n=>{ return {producer:d.producer, name:n} })), []));
        })
    }

    const onNameSelect = (value, option) => {
        props.dispatch(newOrderNewArticleSlice.actions.updateCurrentMaterial({key:'producer', value: option.producer}))
    }

    const saveName = () => {
        console.log('saveName')
        Axios({
            url:'/api/material/name/save', 
            method: 'POST',
            data: { producer: props.currentMaterial.producer, name: props.currentMaterial.name }
        })
        .then((res)=>{
            console.log(res)
            message.success('Sačuvan naziv')
        })
    }

    return (
        <Row gutter={20}>
            <Col span={16}>
                <List
                    itemLayout="horizontal"
                    header={
                        <Row className="w-100">
                            <Col span={10}>
                                <b>Stof</b>
                            </Col>
                            <Col span={12}>
                                <b>Opis</b>
                            </Col>
                        </Row>
                    }
                    locale={{ emptyText: 'Niste dodali stofove' }}
                    dataSource={props.materials}
                    renderItem={(item, index) => (
                    <List.Item> 
                        <Row className="w-100">
                            <Col span={10}>
                                <Row>{item.name} (<i>{item.producer}</i>)</Row>
                            </Col>
                            <Col span={12}>
                                {item.description}
                            </Col>
                            <Col span={2}>
                                <Button  onClick={()=>removeMaterial(index)} icon={<DeleteOutlined />}/>
                            </Col>
                        </Row>
                    </List.Item>
                    )}
                />
            </Col>
            <Col span={8}>
                <Label text={'Proizvodjac'}/>
                <AutoComplete
                    className="w-100"
                    value={props.currentMaterial.producer?props.currentMaterial.producer:''}
                    onChange={(value)=>update(value, 'producer')}
                    options={producerOptions}
                    dropdownMatchSelectWidth
                    onSearch={producerSearch}>
                        <Input placeholder="Proizvodjac" addonAfter={<SaveOutlined onClick={saveProducer}/>}/>
                </AutoComplete>
                <Label text={'Naziv'}/>
                <AutoComplete
                    className="w-100"
                    value={props.currentMaterial.name?props.currentMaterial.name:''}
                    onChange={value => update(value, 'name')}
                    options={nameOptions.map(r => {return { label:r.name, value: r.name, producer: r.producer }; })}
                    onSelect={onNameSelect}
                    dropdownMatchSelectWidth
                    onSearch={nameSearch}>
                        <Input placeholder="Naziv" addonAfter={<SaveOutlined onClick={saveName}/>}/>
                </AutoComplete>
                <Label text={'Opis'}/>
                <TextArea 
                    placeholder="Opis"
                    value={props.currentMaterial.description}
                    onChange={(e)=>update(e.target.value, 'description')}
                    autoSize />
                <Button type="primary" className="w-100 mt-3" onClick={addMaterial}>Dodaj stof</Button>
            </Col>
        </Row>
    )
}

const mapStateToProps = (state) => ({
    currentMaterial: getCurrentMaterial(state),
    materials: getArticleMaterials(state)
})

export default connect(mapStateToProps)(AddMaterials)
