import React, { useState } from 'react'
import Title from 'antd/lib/typography/Title';
import { Input, Button, Card, Empty, Skeleton } from 'antd';
import { Button as MobileButton, TextArea as MobileTextArea, Card as MobileCard } from 'antd-mobile';
import moment from 'moment';
import { connect } from 'react-redux';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';
import { getOrderPreviewId, isOrderPreviewLoading } from '@selectors/ordersSelectors';
import { orderPreviewSlice } from '@reducers/ordersReducers';
import { getUser } from '@selectors/appSelectors';
import { isBrowser, isMobile } from 'react-device-detect';

const OrderPreviewComments = (props) => {

    let [comment, setComment] = useState('');

    const addComment = () => {
        if(comment !== '') {
            Axios.post('/api/order/post-comment', {
                    orderId: props.orderId,
                    comment: comment
            }).then(result => {
                // TODO: Check if everything ok. Also check this everywhere!
                props.dispatch(orderPreviewSlice.actions.postComment({...result.data, writtenBy: props.user}))
                setComment('');
            })
        }
    }

    let flexClassPosition = props.comments.length > 0 ? "d-flex flex-column-reverse" : "d-flex justify-content-center align-items-center"

    return (
        <div className={"d-flex flex-column overflow-auto h-100" + (isMobile?' justify-content-end pb-5':' justify-content-between')}>
            {isBrowser && <div>
                <Title level={4}>Komentari</Title>
            </div>}
            <div className="d-flex flex-column justify-content-end pr-1">
                {props.loading? <Skeleton  className="d-flex justify-content-center align-items-center h-100" active/>:
                    <div className={flexClassPosition} style={{overflowY:'scroll', height:400}}>
                        {props.comments.length === 0 ? <Empty description={<div className="text-secondary">Nema komentara</div>} /> :
                        props.comments.map(item => 
                        
                        
                        (isMobile ? 
                        <MobileCard className='mb-2'>
                            <div className="d-flex justify-content-between mb-1">
                                    <div className="text-secondary">{item.writtenBy.firstName} {item.writtenBy.lastName}</div>
                                    <div className="text-secondary">{moment(item.datePosted).format('HH:mm / DD.MM.YY.').toString()}</div>
                                </div>
                                <div style={{whiteSpace: 'pre-line', fontSize: 17}}>
                                    {item.text}
                                </div>
                        </MobileCard>:
                        <Card className="mb-2" bodyStyle={{padding: 10}}>
                                <div className="d-flex justify-content-between mb-1">
                                    <small className="text-secondary">{item.writtenBy.firstName} {item.writtenBy.lastName}</small>
                                    <small className="text-secondary">{moment(item.datePosted).format('HH:mm / DD.MM.YY.').toString()}</small>
                                </div>
                                <div style={{whiteSpace: 'pre-line'}}>
                                    {item.text}
                                </div>
                            </Card>
                            )).reverse()
                        }
                    </div>
                }
                <div>
                    {isMobile ? 
                    <MobileTextArea
                    autoSize
                    placeholder="Unesite komentar" 
                    value={comment}
                    onChange={(e)=>{setComment(e)}}
                    />
                    :
                    <TextArea 
                        autoSize
                        placeholder="Unesite komentar" 
                        value={comment} 
                        onChange={(e)=>{setComment(e.target.value)}}></TextArea>}
                    {isMobile ? 
                    <MobileButton
                        color='primary'
                        className="mt-2 w-100"
                        onClick={addComment}>
                        Dodaj komentar
                    </MobileButton>
                    :
                    <Button 
                        type={'primary'} 
                        className="mt-2 w-100"
                        onClick={addComment}>
                            Dodaj komentar
                        </Button>}
                </div>
            </div>
        </div>
    )
}

const mapStateToProps = (state) => ({
    orderId: getOrderPreviewId(state),
    user: getUser(state),
    loading: isOrderPreviewLoading(state)
})

export default connect(mapStateToProps)(OrderPreviewComments);
