import React from 'react'
import { Button, Row, Col, List, Select, DatePicker, Input, InputNumber, Checkbox, Card, Descriptions,
    PageHeader} from 'antd';
import Label from '../../../components/Label';

const { TextArea } = Input;
const { Option } = Select;

const CustomerDetails = () => {
    return (
        <Card className='mb-3'> 
            <Descriptions title="Kupac"/>
            <Label text={'Ime i prezime'}/>
            {/* Ovde treba AutoComplete */}
            <TextArea className='mb-2' placeholder="Ime i prezime" autoSize />
            <Label text={'Adresa'}/>
            <TextArea className='mb-2' placeholder="Adresa" autoSize />
            <Label text={'Telefon'}/>
            <TextArea className='mb-2' placeholder="Telefon" autoSize />
            <Select className='mb-2' defaultValue="apartment" >
                <Option value="apartment">Stan</Option>
                <Option value="house">Kuca</Option>
            </Select>
            <InputNumber min={1} max={10} placeholder='Sprat'/>
            <Checkbox>Ima lift</Checkbox>
        </Card>
    )
}

export default CustomerDetails
