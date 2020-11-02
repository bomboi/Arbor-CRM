import React from 'react'
import { Button, Row, Col, List, Select, DatePicker, Input, InputNumber, Checkbox, Card, Descriptions,
    PageHeader} from 'antd';
import Label from '../../../components/Label';

const { TextArea } = Input;
const { Option } = Select;

const PaymentDetails = () => {
    return (
        <Card>
            <Descriptions title="Placanje"/>
            <Label text={'Avans'}/>
            <TextArea className='mb-2' placeholder="Avans" autoSize />
            <Label text={'Avans'}/>
            <TextArea className='mb-2' placeholder="Adresa" autoSize />
            <Label text={'Avans'}/>
            <TextArea className='mb-2' placeholder="Telefon" autoSize />
            <Select className='mb-2' defaultValue="apartment"  >
                <Option value="apartment">Gotovina</Option>
                <Option value="house">Kartica</Option>
                <Option value="house">Cekovi</Option>
            </Select>
            <InputNumber min={1} max={10} placeholder='Sprat'/>
            <Checkbox>Ima lift</Checkbox>
        </Card>
    )
}

export default PaymentDetails
