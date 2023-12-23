import React, {useState} from 'react'
import { Modal, Row, Col, Button, Tag, Select, Spin, Skeleton } from 'antd';
import { Popup, Tabs, Button as MobileButton, Card, ProgressBar, List, Divider, ActionSheet, Picker, NavBar } from 'antd-mobile'
import Title from 'antd/lib/typography/Title';
import OrderPreviewComments from './OrderPreviewComments';
import { Collapse } from 'antd';
import { getPrimaryTagHEXColor, getSecondaryTagHEXColor } from '../../utils';
import OrderFactoryPDF from './OrderFactoryPDF';
import { OrderInvoicePDF, OrderInvoicePreviewPDF } from './OrderDetails/OrderInvoicePDF';
import moment from 'moment';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

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

const OrderPreviewMobile = (props) => {

    const [showActionSheet, toggleActionSheet] = useState(false);
    const [visible, setVisible] = useState(false)

    const history = useHistory();

    const actions = [
        {
            text: 'Obrisi porudzbinu',
            onClick: props.deleteOrder
        },
        {
            text: 'Izmeni porudzbinu',
            onClick: props.editOrder
        }
    ]

    const orderStates = [
        [
          { label: 'Poruceno', value: 'poruceno' },
          { label: 'U izradi', value: 'u izradi' },
          { label: 'Za isporuku', value: 'za isporuku' },
          { label: 'Isporuceno', value: 'isporuceno' },
          { label: 'Reklamacija', value: 'reklamacija' },
          { label: 'Arhivirano', value: 'arhivirano' },
        ]
      ]

    return (
        props.order === undefined ? <></> :
        <>
        {!props.loading && <NavBar onBack={()=>{history.push('/porudzbine')}}>Porudzbina: <b>#{props.order.orderId}</b></NavBar>}
                    <Tabs className='h-100'>
                        <Tabs.Tab title='Pregled' key='fruits' >
                            <div style={{height: '100%', overflowY: 'scroll' , margin:-12}} >
                            <Spin spinning={props.loading}>
                            
                            {/* <Collapse ghost>
                                <Collapse.Panel header={'Opcije'}>
                                    <div className="pl-4 pr-4 pt-3 pb-3 d-flex flex-column">
                                    <Button onClick={props.deleteOrder} type={'primary'} className="mb-2" danger>Obrisi</Button>
                                    <Button onClick={} className="mb-2">Štampaj</Button>
                                    <OrderInvoicePreviewPDF check={() => true} orderId={props.order?props.order.orderId:0}/>
                                    {props.isAdmin && <OrderFactoryPDF className="mb-2 w-100" version={props.version}/>}
                                    <Button className="mb-2">Prijavi reklamaciju</Button>
                                    <Button className="mb-2" onClick={props.editOrder}>Izmeni</Button>
                                    </div>
                                </Collapse.Panel>
                            </Collapse> */}
                <Row>
                    <Col className="pb-4 pt-2" span={24}>
                        {props.loading? <Skeleton active paragraph={{rows:0}}/> :<>
                            
                            <div className='d-flex flex-row justify-content-between mr-2 ml-2'>
                                <div className="align-self-center flex-even">
                                        {!props.isAdmin ? 
                                        <Tag color={'blue'} style={{fontSize:14}} className="mr-0">
                                            {props.order.state.toUpperCase()}
                                        </Tag>
                                        :
                                        <>
                                            <MobileButton
                                                block 
                                                size='small'
                                                style={{
                                                    '--background-color': getSecondaryTagHEXColor(props.firstState),
                                                    '--text-color': getPrimaryTagHEXColor(props.firstState),
                                                    '--border-color': getPrimaryTagHEXColor(props.firstState)}}
                                                fill='solid'
                                                onClick={() => {setVisible(true)}}>
                                                {props.firstState.toUpperCase()}
                                            </MobileButton>
                                            <Picker
                                            columns={orderStates}
                                            visible={visible}
                                            onClose={() => {setVisible(false)}}
                                            confirmText='Sacuvaj'
                                            cancelText='Zatvori'
                                            value={[props.firstState]}
                                            onConfirm={(value) => props.onSelectOrderState(value[0])}
                                            />
                                        </>
                                        }
                                </div>
                                <Divider direction='vertical' style={{height:'inherit'}}/>
                                <div className='flex-even'>
                                        {/* <MobileButton
                                                block 
                                                size='small'>
                                                    Verzija 1
                                                </MobileButton> */}
                                    <props.SelectVersion 
                                        onSelect={props.selectVersion}
                                        number={props.versions.length}/>
                                </div>
                                <Divider direction='vertical' style={{height:'inherit'}}/>
                                <div className='flex-even'>
                                    <MobileButton block size='small' onClick={()=>toggleActionSheet(true)}>Opcije</MobileButton>
                                    <ActionSheet
                                        visible={showActionSheet}
                                        actions={actions}
                                        onClose={() => toggleActionSheet(false)}
                                    />
                                </div>
                            </div>
                            <div className={"d-flex justify-content-between m-3"}>
                                <div className="text-secondary mt-0">
                                    <div>
                                        izdato od: {props.versions[0].changedBy.firstName} {props.versions[0].changedBy.lastName} 
                                    </div>
                                    <div>
                                        trenutna verzija: {props.versions[props.version].changedBy.firstName} {props.versions[props.version].changedBy.lastName} ({moment(props.versions[props.version].dateCreated).format('DD. MM. YYYY.').toString()})
                                    </div>
                                </div>
                            </div>

                        </>}
                        {!props.loading && <>
                            <List header='Kupac' mode='card'>
                                <List.Item>
                                    <h5>{props.order.customer.name}</h5>
                                    <div>{props.order.customer.phone}</div>
                                    <div>{props.order.customer.email}</div>
                                </List.Item>
                            </List >
                            {props.versions[props.version].data.orderInfo.delivery &&
                                <List header='Adresa'  mode='card'>
                                <List.Item>
                                    <div>{props.order.customer.address.street} ({props.order.customer.address.homeType})</div>
                                    <div>{props.order.customer.address.floor}. sprat ({props.order.customer.address.elevator?'ima lift':'nema lift'})</div>
                                </List.Item>
                            </List>}
                            
                            <List header='Placanje'  mode='card'>
                                <List.Item>
                                    <div>Popust: {props.versions[props.version].data.orderInfo.discount}%</div>
                                    <div>Rok isporuke: {props.versions[props.version].data.orderInfo.deadlineFrom} - {props.versions[props.version].data.orderInfo.deadlineTo} dana.</div>
                                    <div>Nacin placanja: {props.versions[props.version].data.orderInfo.paymentType}</div>
                                    <div>Datum: {moment(props.versions[props.version].data.orderInfo.date).format('DD. MM. YYYY.').toString()}</div>
                                    {props.versions[props.version].data.orderInfo.note && <div>Napomena: {props.versions[props.version].data.orderInfo.note}</div>}
                                </List.Item>
                                <List.Item>
                                    <div>Avans: {props.versions[props.version].data.orderInfo.avans} RSD</div>
                                    <div>Preostalo: {props.order.totalAmount - props.versions[props.version].data.orderInfo.avans} RSD</div>
                                    <div>Ukupno: {props.order.totalAmount} RSD</div>
                                </List.Item>
                            </List> 
                        </>}
                        <Divider>Aritkli</Divider>
                        {props.loading ? <></> : 
                            props.versions[props.version].data.articles.map((item, index) => 
                            <List mode='card'>
                                <List.Item>
                                    <div><b>#{index + 1} {item.name}</b></div>
                                    <div>{item.quantity} x {item.price} RSD  {item.discount?("(-" + item.discount + "%)"):""} = {item.quantity * item.price * (item.discount?(100-item.discount)/100:1)} RSD</div>
                                    </List.Item>
                                    <List.Item>
                                    <div style={{whiteSpace:'pre'}}>{item.description}</div>
                                    </List.Item>
                                    {item.materials ?
                                    item.materials.map(material=>
                                        <List.Item>
                                            <div>{material.description}</div>
                                            <div><i>{material.name} ({material.producer})</i></div>
                                        </List.Item>)
                                    :<></>}
                                    
                            </List>
                            )}
                    </Col>
                </Row>
                </Spin>

                            </div>
                    </Tabs.Tab>
                    <Tabs.Tab title='Komentari' key='vegetables'>
                        {!props.loading && <OrderPreviewComments comments = {props.order.comments}/> }
                    </Tabs.Tab>
                </Tabs>
        </>
    )
}

export default OrderPreviewMobile;
