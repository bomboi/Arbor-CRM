import React, { useState, useEffect } from 'react'
import { Modal, Row, Col, Input, Divider, Button, Card, Tag, List, Select, Spin, Skeleton } from 'antd';
import { 
    isOrderPreviewVisible, 
    getOrderPreviewData, 
    getOrderPreviewVersions, 
    isOrderPreviewLoading, 
    getOrderPreviewIndex 
} from '@selectors/ordersSelectors';
import { connect } from 'react-redux';
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { 
    orderPreviewSlice,
    newOrderArticlesSlice, 
    newOrderInfoSlice, 
    newOrderCustomerSlice, 
    orderDetails, 
    orderListSlice
} from '@reducers/ordersReducers';
import { isAdmin } from '@selectors/appSelectors';
import { getTagColor } from '../../utils';
import Axios from 'axios';
import { isBrowser, isMobile, BrowserView, MobileView } from 'react-device-detect';
import OrderFactoryPDF from './OrderFactoryPDF';
import { OrderInvoicePDF, OrderInvoicePreviewPDF } from './OrderDetails/OrderInvoicePDF';
import moment from 'moment';
import OrderPreviewMobile from './OrderPreviewMobile';
import OrderPreviewBrowser from './OrderPreviewBrowser';

const SelectVersion = (props) => {
    const genOptions = (number) => {
        let i = number;
        let options = []
        while(i > 0) {
            options.push(<Select.Option className="text-secondary" value={i}>Verzija {i}</Select.Option>)
            i--;
        }
        return options
    }

    return (
        <Select 
            className="text-secondary" 
            bordered={false} 
            defaultValue={props.number}
            onSelect={props.onSelect}>
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

    let [version, setVersion] = useState(props.versions?props.versions.length - 1:0);
    let history = useHistory();
    let [firstState, setFirstState] = useState('');

    const selectVersion = (value) => {
        setVersion(value - 1);
    };

    useEffect(()=> {
        if(props.order != null) {
            setFirstState(props.order.state);
        }
    }, [props.order])

    useEffect(()=> {
        if(props.versions) {
            setVersion(props.versions.length - 1);
        }
    }, [props.versions])

    const onSelectOrderState = (value) => {
        Axios.post('/api/order/update-state', {
            selectedIds: [props.order._id],
            state: value
        }).then(() => {
            setFirstState(value)
            props.dispatch(orderPreviewSlice.actions.setState(value))
        })
    }

    const complaint = () => {
        Axios.post('/api/order/update-state', {
            orderId: props.order._id,
            state: 'reklamacija'
        }).then(() => {
            setFirstState('reklamacija')
            props.dispatch('reklamacija')
        })
    }

    const deleteOrder = () => {
        // TODO: Set spinner while deleting
        Axios.post('/api/order/delete', {
            ids: [props.order._id]
        }).then(res => {
            // TODO: Check if deleted
            props.dispatch(orderListSlice.actions.deleteOrder(props.orderIndex));
            props.dispatch(orderPreviewSlice.actions.toggleShow());
        });
    }

    const closePreview = () => {
        props.dispatch(orderPreviewSlice.actions.toggleShow());
                    props.dispatch(orderListSlice.actions.updateOrderState({index: props.orderIndex, state: firstState}))
    }

    const editOrder = () => {
        props.dispatch(newOrderArticlesSlice.actions.setArticles(props.versions[props.versions.length - 1].data.articles))
        props.dispatch(newOrderInfoSlice.actions.setOrderInfo(props.versions[props.versions.length - 1].data.orderInfo))
        props.dispatch(newOrderCustomerSlice.actions.setCustomer({customer: props.order.customer, delivery: props.versions[props.versions.length - 1].data.orderInfo.delivery}));
        props.dispatch(orderDetails.actions.initEditMode(true))
        history.push('/porudzbine/izmeni/'+props.order.orderId);
    }

    const componentProps = {
        ...props,
        editOrder: editOrder,
        closePreview: closePreview,
        deleteOrder: deleteOrder,
        complaint: complaint,
        onSelectOrderState: onSelectOrderState,
        selectVersion: selectVersion,
        version: version,
        setVersion: setVersion,
        history: history,
        firstState: firstState,
        setFirstState: setFirstState,
        SelectVersion: SelectVersion,
        SkeletonRow: SkeletonRow
    }

    return (
        isMobile ? <OrderPreviewMobile {...componentProps}/> : <OrderPreviewBrowser {...componentProps}/>
    )
}

const mapStateToProps = (state) => ({
    versions: getOrderPreviewVersions(state),
    visible: isOrderPreviewVisible(state),
    order: getOrderPreviewData(state),
    loading: isOrderPreviewLoading(state),
    orderIndex: getOrderPreviewIndex(state),
    isAdmin: isAdmin(state)
})

export default connect(mapStateToProps)(OrderPreview);
