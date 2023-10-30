import React, { useEffect, useState } from 'react'
import Axios from 'axios';
import moment from 'moment';
import { connect } from 'react-redux';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import { Button, List, message, Badge, Popover } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { isMobile } from 'react-device-detect';


const Notification = (props) => {

    return (
        <List.Item 
            className= { !props.isRead ? 'notification-item-unread' : 'notification-item gray-text' }
            >
            <div onClick={()=>{
                props.setNotificationsPopover(false);
                props.open(props.notification)
            }}>
                <div>
                    {props.notification.text}
                </div>
                <div>
                    <small>{moment(props.notification.dateChanged).format('HH:mm, DD. MM. YYYY.').toString()}</small>
                </div>
            </div>
            <div className='p-2'>
                <Button onClick = { props.deleteNotification }><DeleteOutlined/></Button>
            </div>

        </List.Item>
    );
}

const Notifications = (props) => {

    let [notifications, setNotifications] = useState([]);
    let [notificationBadge, setNotificationBadge] = useState(0);

    let [notificationsPopover, setNotificationsPopover] = useState(false);

    const getNotifications = () => {
        Axios.get('/api/order/notifications', {params: {readNotifications: false}}).then(res => {
            console.log('Call notifications');
            console.log(res.data[0]);
            if(res.data.length > 0) {
                setNotifications(res.data);
                setNotificationBadge(res.data.filter(notification => !notification.isRead).length);
            }
        })
        .catch(error => {
            message.error(error.response.data);
        })
    }

    useEffect(() => {
        getNotifications();
        setInterval(() => {getNotifications()}, 1800000); // 30min (1800000 ms)
    }, [])

    const handleOpenChange = (newOpen) => {
        console.log("handleOpen")
        if(notifications.length > 0) { 
            console.log("open")
            setNotificationsPopover(newOpen);
        }
        else setNotificationsPopover(false);
    };

    const deleteAllNotifications = () => {
        Axios.post('/api/order/delete-notifications').then(res => {
            // setHasNotification(false);
            setNotifications([])
        })
    }

    const deleteNotification = (notification) => {
        console.log(notification._id)
        Axios.post('/api/order/delete-notification', {
            notificationId: notification._id
        }).then(res => {
            // setHasNotification(false);
            setNotifications(notifications.filter(item => item._id != notification._id))
        })
    }

    const openNotification = (notification) => {
        if(notification.type == "orderDeleted" || !notification.orderId) {
            Axios.post('/api/order/read-notification', {
                notificationId: notification._id
            }).then(res => {
                // setHasNotification(false);
                setNotificationBadge(notificationBadge - 1);
            })
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
                notificationId: notification._id
            }).then(res => {
                setNotificationBadge(notificationBadge - 1 > 0 ? notificationBadge - 1 : 0);
            })
        })
    }

    const notificationsRead = notifications.filter(item => item.isRead);
    const notificationsUnread = notifications.filter(item => !item.isRead)

    return    (        
        <Popover
            zIndex={3}
            onVisibleChange={handleOpenChange}
            open={notificationsPopover}
            placement="topLeft" 
            trigger={"click"}
            content={
                <div>
                    <div style={{
                        overflow: 'auto',
                        minWidth: isMobile?'300px':'500px',
                        height: "300px"
                        }}>
                        {notificationsUnread.length > 0 && <List
                            header={<div className="pl-3 gray-text">Nepročitane</div>}
                            size="small"
                            dataSource={notificationsUnread}
                            renderItem={(notification) => 
                                <Notification
                                    isRead = { false }
                                    open = { openNotification }
                                    notification = { notification }
                                    setNotificationsPopover = {  setNotificationsPopover }
                                    deleteNotification = { () => deleteNotification(notification) }
                                />
                            }
                        />}

                        { notificationsRead.length > 0 && <List
                            header={<div className="pl-3 gray-text">Pročitane</div>}
                            size="small"
                            dataSource={notificationsRead}
                            renderItem={(notification) => 
                                <Notification
                                    isRead = { true }
                                    open = { openNotification }
                                    notification = { notification }
                                    setNotificationsPopover = {  setNotificationsPopover }
                                    deleteNotification = { () => deleteNotification(notification) }
                                />
                            }
                        /> }
                        {/* <Button >Obrisi sve</Button> */}
                    </div>
                    <Button 
                        type='link' 
                        block 
                        size='large'
                        onClick={ deleteAllNotifications }
                    >Obriši sve</Button>
                </div>
            } 
            >
            <Button 
                disabled={notifications.length == 0} 
                className='mr-2' 
                key='1' 
                onClick={() => getNotifications(false)}>
                <Badge className='mr-2 mt-0' count={notificationBadge}/> Obaveštenja
            </Button>
        </Popover>
    );
}


const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Notifications);