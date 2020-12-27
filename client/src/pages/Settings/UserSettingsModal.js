import React from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { InputNumber } from 'antd';

const UserSettingsModal = (props) => {
    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            closable={false}
            title={'Promena informacija o nalogu'}
            okText={'Sačuvaj izmene'}
            cancelText={'Zatvori'}>
                <div className="w-100 d-flex">
                    <InputNumber placeholder='Od' className="w-100 mr-1"></InputNumber>
                    <InputNumber placeholder='Do' className="w-100 ml-1"></InputNumber>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(UserSettingsModal);
