import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { InputNumber } from 'antd';
import Axios from 'axios';

const DeadlineModal = (props) => {

    let [deadline, setDeadline] = useState({to: 0, from: 0}); 

    useEffect(() => {
        if(props.visible) {
            Axios.get('/api/setting/default-deadline')
                .then(res => {
                    setDeadline({to: res.data.defaultDeadlineTo, from: res.data.defaultDeadlineFrom});
                });
        }
    }, [props.visible]);

    const onOk = () => {
        Axios.post('/api/setting/default-deadline', {
            from: deadline.from,
            to: deadline.to
        }).then(() => props.onCancel());
    }

    return (
        <Modal
            visible={props.visible}
            closable={false}
            title={'Podrazumevani rok isporuke'}
            okText={'Sačuvaj izmene'}
            onOk={onOk}
            onCancel={props.onCancel}
            cancelText={'Zatvori'}>
                <div className="w-100 d-flex">
                    <InputNumber value={deadline.from} onChange={(val)=>setDeadline(prev=>({...prev, from: val}))} placeholder='Od' className="w-100 mr-1"></InputNumber>
                    <InputNumber value={deadline.to} onChange={(val)=>setDeadline(prev=>({...prev, to:val}))} placeholder='Do' className="w-100 ml-1"></InputNumber>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(DeadlineModal);
