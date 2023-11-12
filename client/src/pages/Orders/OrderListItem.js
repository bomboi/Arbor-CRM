import React, { useState } from 'react'
import { Row, Col, Checkbox, Button, Badge, Tag, Card } from 'antd';
import moment from 'moment';
import { connect } from 'react-redux';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import Axios from 'axios';
import { getTagColor } from '../../utils';
import { isOrderChecked } from '../../Redux/selectors/ordersSelectors';
import { orderListSlice } from '../../Redux/reducers/ordersReducers';
import { BrowserView, MobileView } from 'react-device-detect';

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

    let [hasNotification, setHasNotification] = useState(props.item.hasNotification);

    const open = () => {
        props.dispatch(orderPreviewSlice.actions.setLoading(true))
        Axios.get('/api/order/get-versions', {
            params: {
                orderId: props.item._id
            }
        }).then(result => {
            console.log('Versions');
            console.log(result);
            props.dispatch(orderPreviewSlice.actions.initVersions(result.data.orderVersions));
            props.dispatch(orderPreviewSlice.actions.setData({...props.item, comments: result.data.comments}));
            props.dispatch(orderPreviewSlice.actions.setIndex(props.index));
            props.dispatch(orderPreviewSlice.actions.setLoading(false));
            Axios.post('/api/order/read-notification', {
                orderId: props.item._id
            }).then(res => {
                setHasNotification(false);
            })
        }).then(()=>{
            props.dispatch(orderPreviewSlice.actions.toggleShow());})
    }

    return (
        <Card className={"mt-1 mb-1 " + (props.checked?"bg-light":"")} size={'small'}>
            <BrowserView>
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
                        {hasNotification && <Tag color={'gold'}>NOVE IZMENE</Tag>}
                    </Col>
                    <Col span = {1}>
                        <Checkbox checked={props.checked} onClick={(e)=>props.dispatch(orderListSlice.actions.toggleSelectOrder(props.item._id))}/>
                    </Col>
                    <Col span = {2}>
                        <Button onClick={open}>Otvori</Button>
                    </Col>
                </Row>
            </BrowserView>
            <MobileView>
                <Row>
                    <Col span={12}>
                        <b>{props.item.orderId}</b>
                    </Col>
                    <Col span={12} align={'right'}>
                        <Tag color={getTagColor(props.item.state)} className='mr-0'>{props.item.state.toUpperCase()}</Tag>
                    </Col>
                </Row>
                <Row justify={'space-between'}>
                    <Col span = {12}>
                        {props.item.customer.name}
                    </Col>
                    <Col span={12} align={'right'}>
                        {props.item.totalAmount} <small>RSD</small>
                    </Col>
                </Row>
                <Row justify={'space-between'}>
                    <Col span = {12}>
                        {moment(props.item.latestVersionData.data.orderInfo.date).format('DD. MM. YYYY.').toString()}
                    </Col>
                    <Col span={12} className='mr-0'>
                        {hasNotification && <Tag color={'gold'}>NOVE IZMENE</Tag>}
                    </Col>
                </Row>
                <Row justify={'space-between'}>
                    <Col span = {1}>
                        <Checkbox checked={props.checked} onClick={(e)=>props.dispatch(orderListSlice.actions.toggleSelectOrder(props.item._id))}/>
                    </Col>
                    <Col span = {20} align={'right'}>
                        <Button onClick={open}>Otvori</Button>
                    </Col>
                </Row>
            </MobileView>
        </Card>
    )
}

const mapStateToProps = (state, props) => ({
    checked: isOrderChecked(state, props.index)
})

export default connect(mapStateToProps)(OrderListItem)
