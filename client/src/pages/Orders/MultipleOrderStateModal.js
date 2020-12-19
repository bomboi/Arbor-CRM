import React, { useState } from 'react'
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import { Select, message } from 'antd';
import Axios from 'axios';
import { getSelectedIds } from '../../Redux/selectors/ordersSelectors';
import Title from 'antd/lib/typography/Title';
import { orderListSlice } from '../../Redux/reducers/ordersReducers';

const MultipleOrderStateModal = (props) => {

    let [selected, setSelected] = useState('none');

    const onSelect = (value) => {
        setSelected(value);
    }

    const onOk = () => {
        if(selected === 'none') {
            message.error('Niste izabrali status porudzbine!');
            return;
        }
        Axios.post('/api/order/update-state', {
            state: selected,
            selectedIds: Object.keys(props.selectedIds)
        }).then(res => {
            props.dispatch(orderListSlice.actions.updateOrderState({state:selected}));
            props.onCancel();
        })
    }

    return (
        <Modal
            onOk={onOk}
            okText={'Izmeni selektovane'}
            cancelText={'Zatvori'}
            closable={false}
            onCancel={props.onCancel}
            visible={props.visible}>
                <Title level={4}>Promeni status porudzbina</Title>
                <Select onSelect={onSelect} value={selected} className='w-100' style={{ width: 120 }}>
                    <Select.Option value="none">Izaberi status...</Select.Option>
                    <Select.Option value="poruceno">Poruceno</Select.Option>
                    <Select.Option value="u izradi">U izradi</Select.Option>
                    <Select.Option value="za isporuku">Za isporuku</Select.Option>
                    <Select.Option value="isporuceno">Isporuceno</Select.Option>
                    <Select.Option value="reklamacija">Reklamacija</Select.Option>
                    <Select.Option value="arhivirano">Arhivirano</Select.Option>
                </Select>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    selectedIds: getSelectedIds(state)
})

export default connect(mapStateToProps)(MultipleOrderStateModal);
