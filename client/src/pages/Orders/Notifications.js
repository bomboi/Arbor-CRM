
const Notifications = (props) => {
    return    (        
        <Popover
            zIndex={3}
            onVisibleChange={handleOpenChange}
            open={notificationsPopover}
            placement="topLeft" 
            trigger={"click"}
            content={
                <>
                    {notificationsUnread.length > 0 && <List
                        header={<div className="pl-3 gray-text">Nepročitane</div>}
                        size="small"
                        dataSource={notificationsUnread}
                        renderItem={(notification) => 
                            <List.Item 
                                className='notification-item-unread'
                                onClick={()=>{
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
                    />}

                    { notificationsRead.length > 0 && <List
                        header={<div className="pl-3 gray-text">Pročitane</div>}
                        size="small"
                        dataSource={notificationsRead}
                        renderItem={(notification) => 
                            <List.Item 
                                className='notification-item gray-text'
                                onClick={()=>{
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
                    /> }
                    {/* <Button>Obrisi sve</Button> */}
                </>
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