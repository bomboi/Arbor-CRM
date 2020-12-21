import React, { useEffect } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Card, InputNumber, Divider, Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';

const Settings = (props) => {

    useEffect(()=> {

    }, [])

    return (
        <div>
            <PageHeader
                ghost={false}
                className="mb-3"
                title="Podešavanja"/>
            <Card>
                <Title level={5}>Porudzbina</Title>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Podrazumevani rok isporuke</div>
                    <div>
                        <InputNumber placeholder='Od'></InputNumber>
                        <InputNumber placeholder='Do'></InputNumber>
                    </div>
                </div>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Informacije o firmi na predracunu</div>
                    <div>
                        <TextArea></TextArea>
                    </div>
                </div>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Tekst za napomenu</div>
                    <div>
                        <TextArea></TextArea>
                    </div>
                </div>
                
                <Title className="mt-4" level={5}>Nalog</Title>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Promena informacija o nalogu</div>
                    <div>
                        <Button>Promeni</Button>
                    </div>
                </div>
                <Divider className="mb-3 mt-3"/>
                {/* Admin */}
                <div className="d-flex justify-content-between">
                    <div>Gasenje naloga prodavaca</div>
                    <div>
                        <Button>Promeni</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Settings)
