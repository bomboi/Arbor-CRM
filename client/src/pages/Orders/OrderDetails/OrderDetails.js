import React from 'react'
import { Button, Row, Col, List, Select, DatePicker, Input, InputNumber, Checkbox, Card, Descriptions,
        PageHeader} from 'antd';
import Label from '../../../components/Label';
import CustomerDetails from './CustomerDetails';
import PaymentDetails from './PaymentDetails';
import AddArticle from './AddArticle';
import ArticlesList from './ArticlesList';

const { TextArea } = Input;
const { Option } = Select;

const OrderDetails = (props) => {
    return (
    <div>
    <PageHeader
      ghost={false}
      onBack={() => props.changeView('list')}
      title="Novi predračun"
      className="mb-3"
      style={{ position: 'relative', zIndex: 1, width: '100%' }}
      extra={[
        <Button key="3">Štampaj</Button>,
        <Button key="2">Sačuvaj</Button>,
        <Button key="1" type="primary">
          Sačuvaj i štampaj
        </Button>,
      ]}
    ></PageHeader>
    <Row gutter={[20]}>
        <Col span={8}>
            <CustomerDetails/>
            <PaymentDetails/>
        </Col>
        <Col span={16}>
            <AddArticle/>
            <ArticlesList/>
        </Col>
    </Row>
    </div>
    )
}

export default OrderDetails
