import React, { useEffect, useState } from 'react'
import { useHistory } from "react-router-dom";
import { Button, Row, Col, List, Select, DatePicker, Input, PageHeader, Card, Divider, message, Badge, Popover, notification } from 'antd';
import OrderListItem from './OrderListItem';
import Axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { orderListSlice } from '@reducers/ordersReducers';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import { getOrderList, getLastOrderDate } from '@selectors/ordersSelectors';
import OrderPreview from './OrderPreview';
import { isAdmin } from '@selectors/appSelectors';
import MultipleOrderStateModal from './MultipleOrderStateModal';
import { getSelectedIds } from '../../Redux/selectors/ordersSelectors';
import { DeleteOutlined } from '@ant-design/icons';
import { clearNewOrder } from '../../Redux/reducers/ordersReducers';
import { isMobile, isBrowser } from 'react-device-detect';
import { OrderFactoryPDFMultiple } from './OrderFactoryPDF';

const { RangePicker } = DatePicker;
const { Search } = Input;

const PAGE_SIZE = 10;


const OrderList = (props) => {

    let [filters, setFilters] = useState({
        status: 'sve',
        orderId: '',
        customerName: '',
        range: ['', ''],
        sort: 'Najnovije'
    });

    let [notifications, setNotifications] = useState([]);

    let [notificationsPopover, setNotificationsPopover] = useState(false);

    const handleOpenChange = (newOpen) => {
        setNotificationsPopover(newOpen);
      };

    let [multipleOrderStateModalVisible, setMultipleOrderStateModalVisibility] = useState(false);

    let history = useHistory();

    useEffect(() => {
        load(true);
    }, [filters])
 
    const load = (init = false) => {
        console.log('Page change')
        let params = {
            pageSize: PAGE_SIZE,
            filters: filters,
            lastOrderDate: init ? null : props.lastOrderDate,
        };
        console.log('params')
        console.log(params);
        Axios.get('/api/order/search', { params }).then(res => {
            console.log('Call search')
            console.log(res.data)   
            Axios.get('/api/order/notifications').then(res => {
                console.log('Call notifications');
                console.log(res.data);
                setNotifications(res.data);
            })
            .catch(error => {
                message.error(error.response.data);
            })
            if(init) props.dispatch(orderListSlice.actions.init(res.data))
            else props.dispatch(orderListSlice.actions.update(res.data))
        })
        .catch(error => {
            message.error(error.response.data);
        })

    }

    const update = (value, key) => {
        console.log('update')
        setFilters(prevState => ({...prevState, [key]: value}));
    }

    const updateRange = (value) => {
        setFilters(prevState => ({...prevState, range: value}))
    }

    const unselect = () => {
        props.dispatch(orderListSlice.actions.unselectAll())
    }

    const open = (notification) => {
        if(notification.type == "orderDeleted" || !notification.orderId) {
            return;
        }
        const id = notification.orderId._id;
        props.dispatch(orderPreviewSlice.actions.setLoading(true))
        props.dispatch(orderPreviewSlice.actions.toggleShow());
        setNotificationsPopover(false);
        Axios.get('/api/order/get-versions', {
            params: {
                orderId: id
            }
        }).then(result => {
            console.log('Versions');
            console.log(result);
            props.dispatch(orderPreviewSlice.actions.initVersions(result.data.orderVersions));
            props.dispatch(orderPreviewSlice.actions.setData({...result.data.order, comments: result.data.comments}));
            props.dispatch(orderPreviewSlice.actions.setIndex(props.index));
            props.dispatch(orderPreviewSlice.actions.setLoading(false));
            
            Axios.post('/api/order/read-notification', {
                orderId: result.data.order._id
            }).then(res => {
                // setHasNotification(false);
            })
        })
    }

    const deleteSelected = () => {
        // TODO: Set spinner while deleting
        Axios.post('/api/order/delete', {
            ids: Object.keys(props.selectedIds)
        }).then(res => {
            // TODO: Check if deleted
            props.dispatch(orderListSlice.actions.deleteOrder());
            unselect();
        });
    }

    const extraList = [
        <div className='d-flex align-middle'>
            <Popover
                zIndex={3}
                onOpenChange={handleOpenChange}
                open={notificationsPopover}
                placement="topLeft" 
                className='notification-list'
                trigger={"click"}
                content={
                    <>
                        <List
                            size="small"
                            dataSource={notifications}
                            renderItem={(notification) => 
                                <List.Item className='notification-item' onClick={()=>{
                                    console.log(notification.orderId)
                                    setNotificationsPopover(false);
                                    open(notification)
                                }}>
                                    <div>
                                        <div>
                                            {notification.text}
                                        </div>
                                        <div>
                                            <small>{moment(notification.dateChanged).format('HH:mm, DD. MM. YYYY.').toString()}</small>
                                        </div>
                                    </div>

                                </List.Item>
                            }
                        />
                        {/* <Button>Obrisi sve</Button> */}
                    </>
                } 
                >
                <Button className='mr-2' key='1'>
                    {/* {notifications.length > 0 && <Badge className='mr-2 mt-0' count={notifications.length}/> }  */}
                    Obaveštenja
                </Button>
            </Popover>
            {isBrowser && <Button key='1' type="primary" onClick={()=>{
                props.dispatch(clearNewOrder());
                history.push('/porudzbine/dodaj');
            }}>Nova porudžbina</Button>}
        </div>,
    ];

    return (
    <div>
        <PageHeader
      ghost={false}
      title="Porudžbine"
      className="mb-3"
      extra={extraList}
    ></PageHeader>
        <Card>
            <Row>
                <Col flex={'auto'} className='mb-3'>
                        <Search
                            className={isMobile?'mb-2 w-100':'mr-3'}
                            value={filters.orderId}
                            placeholder="Unesite broj porudžbine"
                            onChange={e => update(e.target.value, 'orderId')}
                            style={{ width: 300 }} />
                        <Search
                            className={isMobile?'mb-2 w-100':'mr-3'}
                            value={filters.customerName}
                            placeholder="Unesite ime kupca"
                            onChange={e => update(e.target.value, 'customerName')}
                            style={{ width: 300 }} />
                        <RangePicker
                            className={isMobile?'mb-2 w-100':'mr-3'}
                            value={filters.range}
                            onChange={value => updateRange(value)}
                            placeholder={['Pocetni datum', 'Krajnji datum']}
                            format={'DD/MM/YYYY'}/>
                        <Select 
                            value={filters.status} 
                            onSelect={value => update(value, 'status')} 
                            className={isMobile?'mb-2 w-100':'mr-3'} 
                            style={{ width: 120 }}>
                            <Select.Option value="sve">Sve</Select.Option>
                            <Select.Option value="poruceno">Poručeno</Select.Option>
                            <Select.Option value="u izradi">U izradi</Select.Option>
                            <Select.Option value="za isporuku">Za isporuku</Select.Option>
                            <Select.Option value="isporuceno">Isporučeno</Select.Option>
                            <Select.Option value="reklamacija">Reklamacija</Select.Option>
                            <Select.Option value="arhivirano">Arhivirano</Select.Option>
                        </Select>
                        <Select 
                            value={filters.sort} 
                            onSelect={value => update(value, 'sort')} 
                            className={isMobile?'mb-2 w-100':'mr-3'} 
                            style={{ width: 120 }}>
                            <Select.Option value="Najnovije">Najnovije</Select.Option>
                            <Select.Option value="Najstarije">Najstarije</Select.Option>
                        </Select>
                </Col>
            </Row>
            <Divider className="mt-1 mb-3"/>
            <div className="mb-2 d-flex justify-content-between">
                <div>
                    <Button onClick={unselect} disabled={Object.keys(props.selectedIds).length === 0} className={isMobile?'mb-2 w-100':'mr-2'} >Odselektuj sve</Button>
                    <Button className={isMobile?'mb-2 w-100':'mr-2'}  onClick={()=>{
                        if(Object.keys(props.selectedIds).length === 0) {
                            message.error('Niste selektovali nijednu porudzbinu!');
                            return;
                        }
                        setMultipleOrderStateModalVisibility(true)
                    }}>Promeni status selektovanih</Button>
                    <OrderFactoryPDFMultiple ids={Object.keys(props.selectedIds)} className={isMobile?'mb-2 w-100':'mr-2'} />
                    <Button onClick={deleteSelected} icon={<DeleteOutlined/>} className={isMobile?'mb-2 w-100':'mr-2'}  type='primary' danger>Obriši selektovane</Button>
                    {isMobile && Object.keys(props.selectedIds).length > 0 && <div className={'d-flex align-self-center font-weight-bold text-primary'}>
                        Selektovane porudžbine: {Object.keys(props.selectedIds).length}
                    </div>}
                </div>
                <div>
                    {isBrowser && Object.keys(props.selectedIds).length > 0 && <div className={'d-flex align-self-center font-weight-bold text-primary'}>
                        Selektovane porudžbine: {Object.keys(props.selectedIds).length}
                    </div>}
                </div>
            </div>
            <Row className="mt-2">
                <Col span={24}>
                    <List 
                        dataSource={props.orders} 
                        renderItem={(item, index) => <OrderListItem item={item} index={index}/>}/>
                </Col>
            </Row>
            <Row justify="center" className="mt-2">
                <Button className="align-self-center" onClick={()=>load()}>Učitaj jos</Button>
            </Row>
        </Card>
        <MultipleOrderStateModal visible={multipleOrderStateModalVisible} onCancel={()=>setMultipleOrderStateModalVisibility(false)}/>
        <OrderPreview/>
    </div>
    )
}

const mapStateToProps = (state) => ({
    orders: getOrderList(state),
    lastOrderDate: getLastOrderDate(state),
    isAdmin: isAdmin(state),
    selectedIds: getSelectedIds(state)
})

export default connect(mapStateToProps)(OrderList);
