import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Card, InputNumber, Divider, Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import DeadlineModal from './DeadlineModal';
import CompanyInfoModal from './CompanyInfoModal';
import OrderNoteModal from './OrderNoteModal';
import UserSettingsModal from './UserSettingsModal';
import ChangePasswordModal from './ChangePasswordModal';

const SuperAdminSettings = (props) => {

    let [visible, setVisible] = useState({
        deadline: false,
        companyInfo: false,
        orderNote: false,
        changePassword: false
    });

    return (
        <div>
            SuperAdminSettings
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(SuperAdminSettings)
