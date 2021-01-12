import React, { useEffect, useState } from 'react'
import { Button, Row, Col, PageHeader, message, Spin} from 'antd';
import CustomerDetails from './CustomerDetails';
import OrderInfo from './OrderInfo';
import AddArticle from './AddArticle';
import ArticlesList from './ArticlesList';
import { useHistory, useParams } from "react-router-dom";
import { OrderInvoicePDF, OrderInvoiceSavePDF } from './OrderInvoicePDF';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getAddedArticles, getOrderInfo, getNewOrderCustomer, usingDelivery } from '@selectors/ordersSelectors';
import { getOrderPreviewVersions, getOrderPreviewData, isEditModeInitialized } from '@selectors/ordersSelectors';
import lo from 'lodash';
import { orderDetails, newOrderArticlesSlice, newOrderInfoSlice, newOrderCustomerSlice, clearNewOrder } from '../../../Redux/reducers/ordersReducers';
import { orderDefaultsSlice } from '../../../Redux/reducers/appReducers';
import { getOrderDefaults } from '../../../Redux/selectors/appSelectors';


const compareObjectsRecursive = (obj1, obj2) => {
    if (obj1 === null) return true;
    else if(typeof(obj1) === 'object') {
      for(let key of Object.keys(obj1)) {
        if(obj2[key] === undefined) return false;
        if(!compareObjectsRecursive(obj1[key], obj2[key])) return false;
      }
      return true;
    }
    else if(obj1 === obj2) return true;
    else return false;
}

const compareObjects = (obj1, obj2) => {
  if(obj1 === null || obj2 === null) return null;
  return compareObjectsRecursive(obj1, obj2);
}

const OrderDetails = (props) => {
  let history = useHistory();
  let {orderId} = useParams();

  let [loading, setLoading] = useState(false);

  let [obj, setObj] = useState(null);

  useEffect(() => {
    if(props.edit){
      // Editing existing order
      if(!props.isEditModeInitialized) {
        Axios.get('/api/order/' + orderId).then(res => {
          console.log(res.data)
          const data = res.data.latestVersionData.data;
          props.dispatch(newOrderArticlesSlice.actions.setArticles(data.articles))
          props.dispatch(newOrderInfoSlice.actions.setOrderInfo(data.orderInfo))
          props.dispatch(newOrderCustomerSlice.actions.setCustomer({customer: res.data.customer, delivery: data.orderInfo.delivery}));
          props.dispatch(orderDetails.actions.initEditMode(true));

          let objData = {};
          objData.articles = data.articles;
          objData.orderInfo = {...data.orderInfo};
          objData.customer = res.data.customer;
          setObj(objData);
        })
      }
      else { // Creating a new order
        setObj(props.orderInfo);
      }
    }
  }, [])

  const isCustomerOk = () => {
    if(props.customer.name === undefined) return false;
    if(props.customer.phone === undefined) return false;
    if(props.usingDelivery) {
      if(props.customer.address === undefined) return false;
      if(props.customer.address.street === undefined) return false;
      if(props.customer.address.floor === undefined) return false;
      if(props.customer.address.elevator === undefined) return false;
      if(props.customer.address.homeType === undefined) return false;
    }
    console.log('Customer Ok!');
    return true;
  }

  const isOrderInfoOk = () => {
    if(props.orderInfo.date === undefined) return false;
    if(props.orderInfo.deadlineFrom === undefined) return false;
    if(props.orderInfo.deadlineTo === undefined) return false;
    if(props.orderInfo.avans === undefined) return false;
    if(props.orderInfo.paymentType === undefined) return false;
    console.log('Order Info Ok!');
    return true;
  }

  const isOrderOk = () => {
    if(props.addedArticles === undefined || props.addedArticles.length === 0) return false;
    console.log('Articles Ok')
    if(!isCustomerOk()) return false;
    if(!isOrderInfoOk()) return false;
    return true;
  }

  const saveOrder = (callback, print = false) => {
    if(!isOrderOk()) message.error('Niste uneli sve potrebne podatke!');
    else {
      let data = {};
      data.articles = props.addedArticles;
      data.orderInfo = {...props.orderInfo};
      data.orderInfo.delivery = props.usingDelivery;
      data.customer = props.customer;
      if(props.edit){
        if(!compareObjects(obj, data)) {
          data.orderId = orderId;
          Axios.post('/api/order/add-version', data)
            .then(() => {
              message.success('Sačuvana porudzbina!');
              setTimeout(() => callback(), 80); 
              if(!print) history.push('/porudzbine');
            })
        }
        else {
          message.error('Niste promenili porudzbinu!');
          return;
        }
      }
      else {
        Axios.post('/api/order/add', data).then(res => {
          message.success('Dodata porudzbina!');
          if(callback) setTimeout(()=> callback(res.data), 50)
        });
      }
      console.log('save order')
    }
  }
  
  const afterPrint = () => {
    props.dispatch(clearNewOrder());
    history.push('/porudzbine')
  }

  return (
  <div>
    {/* Add total price to page header and more info */}
    <PageHeader
      ghost={false}
      onBack={() => history.push('/porudzbine')}
      title={props.edit?("Izmeni porudzbinu #" + orderId):"Nova porudzbina"}
      className="mb-3"
      style={{ position: 'relative', zIndex: 1, width: '100%' }}
      extra={[
        <OrderInvoicePDF check={isOrderOk} orderId={props.edit?orderId:''}/>,
        <Button key="2" onClick={saveOrder}>{props.edit?'Sačuvaj izmenu':'Sačuvaj'}</Button>,
        <OrderInvoiceSavePDF afterPrint={afterPrint} save={saveOrder} orderId={props.edit?orderId:''}/>,
    ]}/>
    {props.edit && !props.isEditModeInitialized ? 
      <div className="h-100 d-flex justify-content-center align-items-center">
        <Spin tip="Ucitavanje..."/>
      </div> 
      :
      <Row gutter={[20]}>
          <Col span={8}>
              <CustomerDetails/>
              <OrderInfo edit={props.edit}/>
          </Col>
          <Col span={16}>
              <ArticlesList/>
          </Col>
      </Row>
    }
  </div>)
}

const mapStateToProps = (state, props) => ({
    addedArticles: getAddedArticles(state),
    orderInfo: getOrderInfo(state),
    customer: getNewOrderCustomer(state),
    usingDelivery: usingDelivery(state),
    isEditModeInitialized: isEditModeInitialized(state),
    orderDefaults: getOrderDefaults(state),
})

export default connect(mapStateToProps)(OrderDetails)
