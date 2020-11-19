import React from 'react'
import { Modal } from 'antd';
import { connect } from 'react-redux';
import { isModalVisible } from '@selectors/customersSelectors';

const CustomerDetailedView = (props) => {
    return (
        <Modal
            visible={props.visible}>
            A
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    visible: isModalVisible(state, 'CustomerDetailedView')
})

export default connect(mapStateToProps)(CustomerDetailedView);
