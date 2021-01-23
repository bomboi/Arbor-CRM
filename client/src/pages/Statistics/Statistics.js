import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Row, Card, Col, Statistic } from 'antd';
import Title from 'antd/lib/typography/Title';
import { Bar } from 'react-chartjs-2';
import { ArrowUpOutlined } from '@ant-design/icons';


const Statistics = () => {

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
