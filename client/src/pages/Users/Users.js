/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react'
import { PageHeader, Button, Row, Col, Card, List, Input, message, Spin } from 'antd';
import { connect } from 'react-redux'


const Users = (props) => {

    return (
        <div>
        <PageHeader
        ghost={false}
        title="Korisnici"
        className="mb-3"/>
            <Card>
                
            </Card>
        </div>
    )
}
const mapStateToProps = (state) => ({
})

export default connect(mapStateToProps)(Users)