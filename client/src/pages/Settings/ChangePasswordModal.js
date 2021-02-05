import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { Input, message } from 'antd';
import Axios from 'axios';

const ChangePasswordModal = (props) => {

    let [newPassword, setNewPassword] = useState('');
    let [oldPassword, setOldPassword] = useState(''); 

    const onOk = () => {
        Axios.post('/api/setting/change-password', {
            old: oldPassword,
            new: newPassword
        }).then(() => {
            message.success('Uspesno promenjena sifra!');
            props.onCancel();
            setNewPassword('');
            setOldPassword('');
        }).catch(error => {
            message.error('Doslo je do greske!');
            message.error(error.response.data);
        });
    }

    return (
        <Modal
            visible={props.visible}
            closable={false}
            title={'Promeni sifru'}
            okText={'Sačuvaj izmene'}
            onOk={onOk}
            onCancel={props.onCancel}
            cancelText={'Zatvori'}>
                <div className="w-100">
                    <Input.Password value={oldPassword} onChange={(e)=>setOldPassword(e.target.value)} placeholder='Stara sifra' className="w-100"></Input.Password>
                </div>
                <div className="w-100 mt-2">
                    <Input.Password value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} placeholder='Nova sifra' className="w-100"></Input.Password>
                </div>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(ChangePasswordModal);
