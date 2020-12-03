import React, { useEffect } from 'react'
import { Select, Input, InputNumber, Card, Typography, DatePicker, Row, Col, Badge} from 'antd';
import Label from '../../../components/Label';
import { connect } from 'react-redux';
import { newOrderInfoSlice } from '@reducers/ordersReducers';
import { getOrderInfo } from '@selectors/ordersSelectors';
import moment from 'moment';

const { TextArea } = Input;
const { Option } = Select;

const { Title } = Typography;

const OrderInfo = (props) => {

    const dateFormat = 'DD. MM. YYYY.';

    useEffect(() => {
        props.dispatch(newOrderInfoSlice.actions.updateOrderInfo({key: 'date', value: moment()}));
    }, []);

    const update = (value, key) => {
        props.dispatch(newOrderInfoSlice.actions.updateOrderInfo({key, value}));
    }

    return (
        <Card>
            <Title level={4}>Dodatne informacije</Title>
            <Row gutter={10}>
                <Col span={12}>
                    <Label text={'Datum'} required/>
                    <DatePicker
                        className="w-100"
                        value={props.orderInfo.date} 
                        placeholder={'Datum porudzbine'} 
                        format={dateFormat}
                        onChange={value => update(value, 'date')} />
                </Col>
                <Col span={12}>
                    <Label text={'Rok isporuke'} required/>
                    <Row gutter={10}>
                        <Col span={11}>
                            <InputNumber 
                                onChange={value => update(value, 'deadlineFrom')}
                                value={props.orderInfo.deadlineFrom}
                                className='w-100' 
                                placeholder="Od" 
                                autoSize />
                        </Col>
                        <Col span={2}> - </Col>
                        <Col span={11}>
                            <InputNumber
                                onChange={value => update(value, 'deadlineTo')}
                                value={props.orderInfo.deadlineTo}
                                className='w-100' 
                                placeholder="Do" 
                                autoSize />
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={10}>
                <Col span={12}>
                    <Label text={'Avans'} required/>
                    <InputNumber
                        onChange={value => update(value, 'avans')}
                        value={props.orderInfo.avans}
                        className='w-100' 
                        placeholder="Avans" 
                        autoSize />
                </Col>
                <Col span={12}>
                    <Label text={'Popust'}/>
                    <InputNumber 
                        formatter={value => `${value}%`} 
                        parser={value => value.replace('%', '')}
                        value={props.orderInfo.discount}
                        className="w-100" 
                        placeholder="Popust"
                        autoSize 
                        onChange={value=>update(value, 'discount')}/>
                </Col>
            </Row>
            <Label text={'Nacin placanja'} required/>
            <Select
                onChange={value => update(value, 'paymentType')}
                value={props.orderInfo.paymentType}
                className='w-100 mb-2'>
                <Option value="gotovina">Gotovina</Option>
                <Option value="kartica">Kartica</Option>
                <Option value="kartica_gotovina">Kartica + Gotovina</Option>
                <Option value="uplata">Uplata na račun</Option>
                <Option value="cekovi">Čekovi</Option>
                <Option value="drugo">Drugo</Option>
            </Select>
            <Label text={'Napomena'}/>
            <TextArea
                onChange={e => update(e.target.value, 'note')}
                value={props.orderInfo.note}
                className='mb-2' 
                placeholder="Napomena" 
                autoSize />
        </Card>
    )
}

const mapStateToProps = (state) => ({
    orderInfo: getOrderInfo(state)
})

export default connect(mapStateToProps)(OrderInfo)
