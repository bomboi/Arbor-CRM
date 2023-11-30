import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Card, InputNumber, Divider, Button } from 'antd';
import Title from 'antd/lib/typography/Title';

const SuperAdminStatistics = (props) => {

    return (
        <div>
            SuperAdminSettings
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(SuperAdminStatistics)
