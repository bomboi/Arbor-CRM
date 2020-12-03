import React from 'react'
import { Row, Col, Checkbox, Button, Badge, Tag, Card } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import Axios from 'axios';

export const OrderListHeader = (props) => {
    return (
        <Row align={'middle'}>
            <Col span = {2}>
                Broj porudzbine
            </Col>
            <Col span = {4}>
                {props.item.customer.name}
            </Col>
            <Col span={3}>
                {props.item.totalAmount} RSD
            </Col>
            <Col span = {3}>
                {moment(props.item.latestVersionData.data.orderInfo.date).format('DD. MM. YYYY.').toString()}
            </Col>
            <Col span={2}>
                Status
            </Col>
            <Col span = {1} offset={7}>
                <Checkbox/>
            </Col>
            <Col span = {2}>
                <Button>Otvori</Button>
            </Col>
            
        </Row>
    )
}

const OrderListItem = (props) => {

    const getTagColor = (state) => {
        switch(state) {
            case 'poruceno': return 'magenta';
        }
    }

    return (
        <Card className="mt-1 mb-1" size={'small'}>
            <Row align={'middle'}>
                <Col span = {2}>
                    <b>{props.item.orderId}</b>
                </Col>
                <Col span = {4}>
                    {props.item.customer.name}
                </Col>
                <Col span={3}>
                    {props.item.totalAmount} <small>RSD</small>
                </Col>
                <Col span = {3}>
                    {moment(props.item.latestVersionData.data.orderInfo.date).format('DD. MM. YYYY.').toString()}
                </Col>
                <Col span={2}>
                    <Tag color={getTagColor(props.item.state)}>{props.item.state.toUpperCase()}</Tag>
                </Col>
                <Col span={2} offset={5}>
                    <Tag color={'gold'}>NOVE IZMENE</Tag>
                </Col>
                <Col span = {1} >
                    <Checkbox/>
                </Col>
                <Col span = {2}>
                    <Button onClick={()=>{
                        props.dispatch(orderPreviewSlice.actions.setLoading(true))
                        props.dispatch(orderPreviewSlice.actions.toggleShow());
                        Axios.get('/api/order/get-versions', {
                            params: {
                                orderId: props.item._id
                            }
                        }).then(result => {
                            console.log('Versions')
                            console.log(result)
                            props.dispatch(orderPreviewSlice.actions.initVersions(result.data.orderVersions))
                            props.dispatch(orderPreviewSlice.actions.setData({...props.item, comments: result.data.comments}));
                            props.dispatch(orderPreviewSlice.actions.setLoading(false))
                        })
                    }}>Otvori</Button>
                </Col>
            </Row>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(OrderListItem)
