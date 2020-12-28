import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { InputNumber } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import Axios from 'axios';

const OrderNoteModal = (props) => {

    let [text, setText] = useState('');

    useEffect(() => {
        Axios.get('/api/setting/order-note')
            .then(res => {
                setText(res.data);
            })
    }, [])

    useEffect(() => {
        if(!props.visible) {
            Axios.get('/api/setting/order-note')
                .then(res => {
                    setText(res.data);
                })
        }
    }, [props.visible])

    const onOk = () => {
        Axios.post('/api/setting/order-note', {text: text}).then(() => props.onCancel())
    }

    return (
        <Modal
            visible={props.visible}
            onCancel={props.onCancel}
            closable={false}
            title={'Tekst za napomenu'}
            okText={'Sačuvaj izmene'}
            onOk={onOk}
            cancelText={'Zatvori'}>
                <div className="w-100 d-flex">
                    <TextArea autoSize={true} value={text} onChange={e => setText(e.target.value)}></TextArea>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(OrderNoteModal);
