import React from 'react'
import { Button, Row, Col, PageHeader, message} from 'antd';
import CustomerDetails from './CustomerDetails';
import OrderInfo from './OrderInfo';
import AddArticle from './AddArticle';
import ArticlesList from './ArticlesList';
import { useHistory } from "react-router-dom";
import OrderInvoicePDF from './OrderInvoicePDF';
import Axios from 'axios';
import { connect } from 'react-redux';
import { getAddedArticles, getOrderInfo, getNewOrderCustomer, usingDelivery } from '@selectors/ordersSelectors';

const OrderDetails = (props) => {
  let history = useHistory();

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

  const saveOrder = () => {
    if(!isOrderOk()) message.error('Niste uneli sve potrebne podatke!');
    else {
      console.log('save order')
      let data = {};
      data.articles = props.addedArticles;
      data.orderInfo = {...props.orderInfo, date: props.orderInfo.date.toDate()};
      data.orderInfo.delivery = props.usingDelivery;
      data.customer = props.customer;
      Axios.post('/api/order/add', data);
    }
  }

  return (
  <div>
    {/* Add total price to page header and more info */}
    <PageHeader
      ghost={false}
      onBack={() => history.push('/porudzbine')}
      title={props.edit?"Izmeni porudzbinu":"Nova porudzbina"}
      className="mb-3"
      style={{ position: 'relative', zIndex: 1, width: '100%' }}
      extra={[
        <OrderInvoicePDF/>,
        <Button key="2" onClick={saveOrder}>Sačuvaj</Button>,
        <Button key="1"  onClick={saveOrder} type="primary">
          Sačuvaj i štampaj
        </Button>,
    ]}/>
    <Row gutter={[20]}>
        <Col span={8}>
            <CustomerDetails/>
            <OrderInfo/>
        </Col>
        <Col span={16}>
            <AddArticle/>
            <ArticlesList/>
        </Col>
    </Row>
  </div>)
}

const mapStateToProps = (state) => ({
    addedArticles: getAddedArticles(state),
    orderInfo: getOrderInfo(state),
    customer: getNewOrderCustomer(state),
    usingDelivery: usingDelivery(state)
})

export default connect(mapStateToProps)(OrderDetails)
