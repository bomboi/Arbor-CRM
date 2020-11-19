import React, { useState } from 'react'
import { Button, Row, Col, Input, AutoComplete, Divider, List } from 'antd';
import Label from '../../../components/Label';
import { collect } from 'react-recollect';
import {
    SaveOutlined, DeleteOutlined
  } from '@ant-design/icons';
import Axios from 'axios';
import { AddArticleStore } from '../../stores';

const { TextArea } = Input;

const AddMaterials = (props) => {

    const store = AddArticleStore(props);

    let [info, setInfo] = useState({})
    let [producer, setProducer] = useState()
    let [name, setName] = useState();
    let [producerOptions, setProducerOptions] = useState([])
    let [nameOptions, setNameOptions] = useState([])
    let [description, setDescription] = useState();

    let [showMaterials, setShowMaterials] = useState(true)

    const addMaterial = () => {
        console.log('current')
        console.log(store.current)
        if(store.current.materials == undefined) store.current.materials = []
        store.current.materials.push({producer: info.producer, name: info.name, description: description});
        setProducer('');
        setName('');
        setInfo({});
        setDescription('');
    }

    const removeMaterial = (index) => {
        store.current.materials.splice(index, 1);
    }

    const onChangeDescription = (e) => setDescription(e.target.value)

    const producerSearch = (value) => {
        let temp = info;
        temp.producer = value;
        setInfo(temp)
        Axios({
            url:'/api/material/producers', 
            method: 'GET',
            params: { value:value }
        })
        .then((res)=>{
            console.log(res.data)
            setProducerOptions(res.data.map(r => { return { label:r, value:r }; } ));
        })
    }

    const onProducerSelect = (value) => {
        let temp = info;
        temp.producer = value;
        setInfo(temp)
        console.log(info)
    }

    const onChangeProducer = (value) => {
        let temp = info;
        temp.producer = value;
        setInfo(temp)
        setProducer(value);
    }

    const saveProducer = () => {
        console.log('saveProducer')
        Axios({
            url:'/api/material/producers/save', 
            method: 'POST',
            data: { value: info.producer }
        })
        .then((res)=>{
            console.log(res)
            // setMaterialProducerOptions(res.data.map(r => { return { label:r, value:r }; } ));
        })
    }

    const nameSearch = (value) => {
        let temp = info;
        temp.name = value;
        setName(value);
        setInfo(temp)
        Axios({
            url:'/api/material/names', 
            method: 'GET',
            params: { name: value, producer: temp.producer }
        })
        .then((res)=>{
            console.log('Names')
            setNameOptions(res.data.reduce((acc, d)=>acc.concat(d.names.map(n=>{ return {producer:d.producer, name:n} })), []));
        })
    }

    const onNameSelect = (value, option) => {
        let temp = info;
        temp.name = value;
        temp.producer = option.producer
        setName(value);
        setProducer(option.producer)
        setInfo(temp);
        console.log(info);
    }

    const saveName = () => {
        console.log('saveName')
        console.log(info)
        Axios({
            url:'/api/material/name/save', 
            method: 'POST',
            data: { producer: info.producer, name: info.name }
        })
        .then((res)=>{
            console.log(res)
            // setMaterialProducerOptions(res.data.map(r => { return { label:r, value:r }; } ));
        })
    }



    return (
        <div>
            <Divider orientation="left">
                <div className="d-flex align-items-center" onClick={()=>setShowMaterials(!showMaterials)}>
                    Stof
                </div>
            </Divider>
            {showMaterials && <div>
            <Row gutter={[20,10]}>
                <Col span={12}>
                    <Row gutter={[20,10]}>
                        <Col span={12}>
                            <Label text={'Proizvodjac i naziv'}/>
                            <AutoComplete
                                className="w-100"
                                value={producer}
                                onChange={onChangeProducer}
                                options={producerOptions}
                                dropdownMatchSelectWidth
                                onSelect={onProducerSelect}
                                onSearch={producerSearch}>
                                    <Input placeholder="Proizvodjac" addonAfter={<SaveOutlined onClick={saveProducer}/>}/>
                            </AutoComplete>
                        </Col>
                        <Col span={12}>
                            <Label text={'Opis'}/>
                            <TextArea 
                                placeholder="Opis"
                                value={description}
                                onChange={onChangeDescription}
                                autoSize />
                        </Col>
                    </Row>
                    <Row gutter={[20,10]}>
                        <Col span={12}>
                            <AutoComplete
                                className="w-100"
                                options={nameOptions.map(r => {return { label:r.name, value: r.name, producer: r.producer }; })}
                                onSelect={onNameSelect}
                                value={name}
                                dropdownMatchSelectWidth
                                onSearch={nameSearch}>
                                    <Input placeholder="Naziv" addonAfter={<SaveOutlined onClick={saveName}/>}/>
                            </AutoComplete>
                        </Col>
                        <Col span={12}>
                            <Button onClick={addMaterial}>Dodaj stof</Button>
                        </Col>
                    </Row>
                </Col>
                <Col span={12}>
                    <Label text={'Dodati stofovi'}/>
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
                        dataSource={store.current.materials}
                        renderItem={(item, index) => (
                        <List.Item> 
                            <Row className="w-100">
                                <Col span={10}>
                                    <Row>{item.producer}</Row>
                                    <Row>{item.name}</Row>
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
            </Row>
            <Row justify={'end'}>
            </Row></div>}
        </div>
    )
}

export default collect(AddMaterials)
