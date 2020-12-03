import React, { useState } from 'react'
import { Modal, Row, Col, Input, Divider, Button, Card, Tag, List, Select, Spin, Skeleton } from 'antd';
import { isOrderPreviewVisible, getOrderPreviewData, getOrderPreviewVersions, isOrderPreviewLoading } from '@selectors/ordersSelectors';
import { connect } from 'react-redux';
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import { DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { newOrderArticlesSlice } from '../../Redux/reducers/ordersReducers';

const SelectVersion = (props) => {
    const genOptions = (number) => {
        let i = number + 1;
        let options = []
        while(i > 0) {
            options.push(<Select.Option className="text-secondary" value={i}>{i} Verzija</Select.Option>)
            i--;
        }
        return options
    }

    return (
        <Select className="text-secondary" bordered={false} defaultValue={props.number + 1}>
            {genOptions(props.number)}
        </Select>
    )
}

const SkeletonRow = (props) => {
    return props.loading ? <Skeleton active paragraph={{rows:1}}/> :
        <Row>
            {props.children}
        </Row>
}

const OrderPreview = (props) => {

    let [version, setVersion] = useState(props.versions.length);
    let history = useHistory();

    return (
        <Modal 
            bodyStyle={{padding: 0}}
            width={1200}
            centered
            footer={null}
            visible={props.visible}
            closable = {false}>
            <Spin spinning={props.loading}>
            <Row justify={'space-between'} className="pl-4 pr-4 pt-3 pb-3">
                <div>
                    <Button type={'primary'} className="mr-2" danger>Obrisi</Button>
                    <Button onClick={()=>{
                        props.dispatch(newOrderArticlesSlice.actions.setArticles(props.versions[version].data.articles))
                        history.push('/porudzbine/izmeni/'+props.order.orderId);
                    }}>Izmeni</Button>
                </div>
                <Button onClick={()=>props.dispatch(orderPreviewSlice.actions.toggleShow())}>Zatvori</Button>
            </Row>
            <Divider className="m-0"/>
            <Row>
                <Col className="pl-4 pr-4 pb-4 pt-2" span={18}>
                    {props.loading? <Skeleton active paragraph={{rows:0}}/> :<>
                        <small className="text-secondary mt-0">izdato od: {props.versions[0].changedBy.firstName} {props.versions[0].changedBy.lastName}</small>
                        <div className="d-flex justify-content-between mb-2">
                            <div className="d-flex align-items-end">
                                <Title level={4} className="mb-0">#{props.order.orderId}</Title>
                            </div>
                            <div className="align-self-center">
                                <SelectVersion number={version}/>
                                <Tag color={'blue'} style={{fontSize:14}} className="mr-0">{props.order.state.toUpperCase()}</Tag>
                            </div>
                        </div>
                    </>}
                    <Collapse ghost style={{overflowY:'scroll', height:470}} defaultActiveKey={['customer', 'info', 'articles']}>
                        <Collapse.Panel key={'customer'} header={'Kupac' }>
                            <Card>
                                <SkeletonRow loading={props.loading}>
                                    {!props.loading && <>
                                    <Col span={6}>
                                        <Title level={4} className="mb-1">{props.order.customer.name}</Title>
                                        <div>{props.order.customer.phone}</div>
                                        <div>{props.order.customer.email}</div>
                                    </Col>
                                    {
                                        props.versions[version].data.orderInfo.delivery &&
                                        <Col span={6}>
                                            <div>Milana Grola 5</div>
                                            <div>Sprat 5</div>
                                        </Col>
                                    }
                                    </>}
                                </SkeletonRow>
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel key={'info'} header={'Informacije'}>
                            <Card>
                                <SkeletonRow loading={props.loading}>
                                {!props.loading && <>
                                    <Col span={5}>
                                        <Title level={5} className="pb-0 mb-0" type={'secondary'}>Ukupan iznos</Title>
                                        <Title level={4} className="mt-1">{props.order.totalAmount}00 RSD</Title>
                                    </Col>
                                    <Col span={5}>
                                        <Title level={5} className="pb-0 mb-0" type={'secondary'}>Avans</Title>
                                        <Title level={4} className="mt-1">{props.versions[version].data.orderInfo.avans} RSD</Title>
                                    </Col>
                                    <Col span={6}>
                                        <div>Avans: 15000 RSD</div>
                                        <div>Popust: 20%</div>
                                        <div>Rok isporuke: 30 - 40 dana.</div>
                                        <div>Nacin placanja: Gotovina</div>
                                    </Col>
                                    </>}
                                </SkeletonRow>
                            </Card>
                        </Collapse.Panel>
                        <Collapse.Panel key={'articles'} header={'Artikli'}>
                            <List
                                header={<Row className="w-100">
                                    <Col span={4}>
                                        <b>Naziv</b>
                                    </Col>
                                    <Col span={8}>
                                        <b>Opis</b>
                                    </Col>
                                    <Col span={8}>
                                        <b>Materijali</b>
                                    </Col>
                                    <Col span={1}>
                                        <b>Kol.</b>
                                    </Col>
                                    <Col span={3}>
                                        <b>Cena</b>
                                    </Col>
                                </Row>}
                                dataSource={props.loading?[]:props.versions[version].data.articles}
                                renderItem={item => 
                                <Row className="w-100 mt-1" align={'middle'}>
                                    <Col span={4}>
                                        {item.name}
                                    </Col>
                                    <Col span={8} style={{whiteSpace:'pre'}}>
                                        {item.description}
                                    </Col>
                                    <Col span={8}>
                                        {item.materials?item.materials.map(material=>material.name):"Nema materijala"}
                                    </Col>
                                    <Col span={1}>
                                        {item.quantity}
                                    </Col>
                                    <Col span={3}>
                                        {item.price}
                                    </Col>
                                </Row>}>
                            </List>
                        </Collapse.Panel>
                    </Collapse>
                </Col>
                <Col className="p-4 bg-light" span={6}>
                    {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                </Col>
            </Row>
            </Spin>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    versions: getOrderPreviewVersions(state),
    visible: isOrderPreviewVisible(state),
    order: getOrderPreviewData(state),
    loading: isOrderPreviewLoading(state)
})

export default connect(mapStateToProps)(OrderPreview);
