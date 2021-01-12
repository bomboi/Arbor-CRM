import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Row, Card, Col, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Bar } from 'react-chartjs-2';
import { ArrowUpOutlined } from '@ant-design/icons';


const Statistics = () => {
    
    const data1 = {
        labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
        datasets: [
            {
            label: 'Trenutna godina',
            backgroundColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            data: [65, 59, 80, 81, 56, 55, 40]
            },
            {
            label: 'Prosla godina',
            backgroundColor: 'rgba(155,59,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            data: [60, 49, 80, 81, 56, 55, 40]
            }
        ]
    }

    const data2 = {
        labels: ['Januar', 'Februar', 'Mart', 'April', 'Maj', 'Jun', 'Jul', 'Avgust', 'Septembar', 'Oktobar', 'Novembar', 'Decembar'],
        datasets: [
            {
            label: 'Trenutna godina',
            backgroundColor: 'rgba(255,99,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            data: [65000, 57000, 36000, 54000, 36000, 25000, 40000, 10000, 60000, 39000]
            },
            {
            label: 'Prosla godina',
            backgroundColor: 'rgba(155,59,132,1)',
            borderWidth: 1,
            hoverBackgroundColor: 'rgba(255,99,132,0.4)',
            data: [60000, 49000, 10000, 64000, 95000, 12000, 41000, 57000, 29000, 68000, 23000]
            }
        ]
    }

    useEffect(() => {
        // Axios
    }, [])

    return (
        <div>
            <PageHeader
                ghost={false}
                title="Statistika"
                className="mb-3"
                extra={[]}/>
            <Row gutter={[20]}>
                <Col span={12}>
                    <Card>
                        <Title level={4}>Broj porudžbina po mesecima</Title>
                        <Bar
                            data={data1}
                            backgroundColor={'000'}
                            width={100}
                            height={40}
                            />
                    </Card>
                    <Card className="mt-4 mb-4">
                        <Title level={4}>Promet po mesecima</Title>
                        <Bar
                            data={data2}
                            backgroundColor={'000'}
                            width={100}
                            height={40}
                            />
                    </Card>
                </Col>
                <Col span={12}>
                    <Card>
                        <Title level={4}>Broj porudžbina</Title>
                        <Row gutter={[10, 10]}>
                            <Col span={8}>
                                <Statistic
                                title="Trenutni mesec"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                            <Col span={8}>
                                <Statistic
                                title="Prošli mesec"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                        </Row>
                        <Row gutter={[10, 10]}>
                            <Col span={8}>
                                <Statistic
                                title="Trenutna godina"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                            <Col span={8}>
                                <Statistic
                                title="Prošla godina"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                        </Row>
                    </Card>
                    <Card className="mt-4">
                        <Title level={4}>Promet</Title>
                        <Row gutter={[10]}>
                            <Col span={8}>
                                <Statistic
                                title="Trenutna godina"
                                value={270000}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="RSD"/>
                            </Col>
                            <Col span={8}>
                                <Statistic
                                title="Prošla godina"
                                value={150000}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="RSD"/>
                            </Col>
                        </Row>
                        <Row gutter={[10]} className="mt-3">
                            <Col span={8}>
                                <Statistic
                                title="Trenutna godina"
                                value={270000}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="RSD"/>
                            </Col>
                            <Col span={8}>
                                <Statistic
                                title="Prošla godina"
                                value={150000}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="RSD"/>
                            </Col>
                        </Row>
                    </Card>
                    <Card className="mt-4">
                        <Title level={4}>Reklamacije</Title>
                        <Row gutter={[10, 10]}>
                            <Col span={8}>
                                <Statistic
                                title="Trenutni mesec"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                            <Col span={8}>
                                <Statistic
                                title="Prošli mesec"
                                value={11.28}
                                precision={2}
                                valueStyle={{ color: '#3f8600' }}
                                prefix={<ArrowUpOutlined />}
                                suffix="%"/>
                            </Col>
                        </Row>
                    </Card>
                </Col>
            </Row>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Statistics)
