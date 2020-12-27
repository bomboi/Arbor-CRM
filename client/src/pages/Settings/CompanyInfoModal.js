import React from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';

const CompanyInfoModal = (props) => {
    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            closable={false}
            title={'Informacije o firmi'}
            okText={'Sačuvaj izmene'}
            cancelText={'Zatvori'}>
                <div className="w-100 d-flex">
                    <TextArea></TextArea>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(CompanyInfoModal);
