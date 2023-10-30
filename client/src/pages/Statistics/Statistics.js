import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Row, Card, Col, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Bar, HorizontalBar } from 'react-chartjs-2';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import Axios from 'axios';
import { useState } from 'react';
import { isBrowser, isMobile, BrowserView, MobileView } from 'react-device-detect';

const meseci = {
    1: "Januar",
    2: "Februar",
    3: "Mart",
    4: "April",
    5: "Maj",
    6: "Jun",
    7: "Jul",
    8: "Avgust",
    9: "Septembar",
    10: "Oktobar",
    11: "Novembar",
    12: "Decembar"
}


const Statistics = () => {
    let [data, setData] = useState({});
    useEffect(() => {
        // Axios
        Axios.get('/api/statistic/get')
        .then(res => {
            console.log(res.data)
            setData(res.data);
        })
    }, [])

    let thisMonthHigherPrice = data.orderPrice > data.orderPriceLastMonth;
    let thisMonthHigherCount = data.orderCount > data.orderCountLastMonth;

    return (
        <div>
            <PageHeader
                ghost={false}
                title="Statistika"
                className="mb-3"
                extra={[]}/>
            <BrowserView>
                <Row gutter={[20]}>
                    <Col span={12}>
                        <Card>
                            <Title level={4}>Promet</Title>
                            <Row gutter={[10]}>
                                <Col span={8}>
                                    <Statistic
                                    title="Trenutni mesec"
                                    value={data.orderPrice}
                                    precision={2}
                                    valueStyle={{ color: thisMonthHigherPrice ? '#3f8600' : '#d10f0f'}}
                                    prefix={thisMonthHigherPrice ? <ArrowUpOutlined /> : <ArrowDownOutlined/>}
                                    suffix="RSD"/>
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                    title="Prošli mesec"
                                    value={data.orderPriceLastMonth}
                                    precision={2}
                                    valueStyle={{ color: '#999' }}
                                    suffix="RSD"/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Title level={4}>Broj porudžbina</Title>
                            <Row gutter={[10]}>
                                <Col span={8}>
                                    <Statistic
                                    title="Trenutni mesec"
                                    value={data.orderCount}
                                    precision={0}
                                    valueStyle={{ color: thisMonthHigherPrice ? '#3f8600' : '#d10f0f' }}
                                    prefix={thisMonthHigherPrice ? <ArrowUpOutlined /> : <ArrowDownOutlined/>}/>
                                </Col>
                                <Col span={8}>
                                    <Statistic
                                    title="Prošli mesec"
                                    value={data.orderCountLastMonth}
                                    precision={0}
                                    valueStyle={{ color: '#999' }}/>
                                </Col>
                            </Row>
                        </Card>
                    </Col>
                </Row>
                {/* <Card>
                    {data.ordersPerMonth && console.log(data.ordersPerMonth.filter(input => input._id.godina == 2022).map(input => input.promet))}
                {data.ordersPerMonth && <Bar
                        height={100}
                        data = {{
                            labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
                            datasets: [
                                {
                                    label: '2022',
                                    data: data.ordersPerMonth.filter(input => input._id.godina == 2022).map(input => input.promet),
                                    backgroundColor: 'gray'
                                },
                                {
                                    label: '2023',
                                    data: data.ordersPerMonth.filter(input => input._id.godina == 2023).map(input => input.promet),
                                    backgroundColor: 'green'
                                },
                            ]
                        }}
                    />} 
                </Card> */}
                <Row className="mt-3" gutter={[20]}>
                    <Col span={24}>
                        <Card>
                            <Title level={4}>Porudzbine po mesecima</Title>
                            {data.ordersPerMonth && data.ordersPerMonth.reverse().map(orderData => 
                            <>
                                <div><b>{meseci[orderData._id.mesec]} {orderData._id.godina}</b></div>
                                <Row>
                                    <Col span={12}>
                                        <Statistic
                                        value={orderData.brPorudz}
                                        valueStyle={{ color: '#999' }}
                                        precision={0}/>
                                    </Col>
                                    <Col span={12}>
                                        <Statistic
                                        value={orderData.promet}
                                        precision={0}
                                        valueStyle={{ color: '#999' }}
                                        suffix="RSD"/>
                                    </Col>
                                </Row>
                            </>)}
                        </Card>
                    </Col>
                </Row>
            </BrowserView>
            <MobileView>
                <Card>
                    <Title level={4}>Promet</Title>
                    <Row gutter={[10]}>
                        <Col span={12}>
                            <Statistic
                            title="Trenutni mesec"
                            value={data.orderPrice}
                            precision={2}
                            valueStyle={{ color: thisMonthHigherPrice ? '#3f8600' : '#d10f0f'}}
                            prefix={thisMonthHigherPrice ? <ArrowUpOutlined /> : <ArrowDownOutlined/>}
                            suffix="RSD"/>
                        </Col>
                        <Col span={12}>
                            <Statistic
                            title="Prošli mesec"
                            value={data.orderPriceLastMonth}
                            precision={2}
                            valueStyle={{ color: '#999' }}
                            suffix="RSD"/>
                        </Col>
                    </Row>
                </Card>
                <Card>
                    <Title level={4}>Broj porudžbina</Title>
                    <Row gutter={[10]}>
                        <Col span={12}>
                            <Statistic
                            title="Trenutni mesec"
                            value={data.orderCount}
                            precision={0}
                            valueStyle={{ color: thisMonthHigherPrice ? '#3f8600' : '#d10f0f' }}
                            prefix={thisMonthHigherPrice ? <ArrowUpOutlined /> : <ArrowDownOutlined/>}/>
                        </Col>
                        <Col span={12}>
                            <Statistic
                            title="Prošli mesec"
                            value={data.orderCountLastMonth}
                            precision={0}
                            valueStyle={{ color: '#999' }}/>
                        </Col>
                    </Row>
                </Card>
                {/* <Card>
                    {data.ordersPerMonth && console.log(data.ordersPerMonth.filter(input => input._id.godina == 2022).map(input => input.promet))}
                {data.ordersPerMonth && <HorizontalBar
                        height={400}
                        data = {{
                            labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
                            datasets: [
                                {
                                    label: '2022',
                                    data: data.ordersPerMonth.filter(input => input._id.godina == 2022).map(input => input.promet),
                                    backgroundColor: 'blue'
                                },
                                {
                                    label: '2023',
                                    data: data.ordersPerMonth.filter(input => input._id.godina == 2023).map(input => input.promet),
                                    backgroundColor: 'green'
                                },
                                // {
                                //     label: '2021',
                                //     data: data.ordersPerMonth.filter(input => input._id.godina == 2021).map(input => input.promet),
                                //     backgroundColor: 'red'
                                // }
                            ]
                        }}
                    />} 
                </Card> */}
                <Card>
                    <Title level={4}>Porudzbine po mesecima</Title>
                    {data.ordersPerMonth && data.ordersPerMonth.reverse().map(orderData => 
                    <>
                        <div><b>{meseci[orderData._id.mesec]} {orderData._id.godina}</b></div>
                        <Row>
                            <Col span={12}>
                                <Statistic
                                value={orderData.brPorudz}
                                valueStyle={{ color: '#999' }}
                                precision={0}/>
                            </Col>
                            <Col span={12}>
                                <Statistic
                                value={orderData.promet}
                                precision={0}
                                valueStyle={{ color: '#999' }}
                                suffix="RSD"/>
                            </Col>
                        </Row>
                    </>)}
                </Card>
            </MobileView>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Statistics)
