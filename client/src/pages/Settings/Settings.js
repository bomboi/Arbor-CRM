import React, { useEffect, useState } from 'react'
import { connect } from 'react-redux';
import { PageHeader, Card, InputNumber, Divider, Button } from 'antd';
import Title from 'antd/lib/typography/Title';
import TextArea from 'antd/lib/input/TextArea';
import DeadlineModal from './DeadlineModal';
import CompanyInfoModal from './CompanyInfoModal';
import OrderNoteModal from './OrderNoteModal';
import UserSettingsModal from './UserSettingsModal';

const Settings = (props) => {

    let [visible, setVisible] = useState({
        deadline: false,
        companyInfo: false,
        orderNote: false,
        userSettings: false
    });

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
                    <Button onClick={()=>setVisible({deadline:true})}>Izmeni</Button>
                    <DeadlineModal visible={visible.deadline} onCancel={()=>setVisible({deadline:false})}/>
                </div>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Informacije o firmi na predracunu</div>
                    <Button onClick={()=>setVisible({companyInfo:true})}>Izmeni</Button>
                    <CompanyInfoModal visible={visible.companyInfo} onCancel={()=>setVisible({companyInfo:false})}/>
                </div>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Tekst za napomenu</div>
                    <Button onClick={()=>setVisible({orderNote:true})}>Izmeni</Button>
                    <OrderNoteModal visible={visible.orderNote} onCancel={()=>setVisible({orderNote:false})}/>
                </div>
                
                <Title className="mt-4" level={5}>Nalog</Title>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Promena informacija o nalogu</div>
                    <Button onClick={()=>setVisible({userSettings:true})}>Izmeni</Button>
                    <UserSettingsModal visible={visible.userSettings} onCancel={()=>setVisible({userSettings:false})}/>
                </div>
                <Divider className="mb-3 mt-3"/>
                <div className="d-flex justify-content-between">
                    <div>Promena šifre</div>
                    {/* TODO: Create a new modal */}
                    <Button onClick={()=>setVisible({userSettings:true})}>Izmeni</Button>
                    <UserSettingsModal visible={visible.userSettings} onCancel={()=>setVisible({userSettings:false})}/>
                </div>
                <Divider className="mb-3 mt-3"/>
                {/* Admin */}
                <div className="d-flex justify-content-between">
                    <div>Gasenje naloga prodavaca</div>
                    <div>
                        <Button>Izmeni</Button>
                    </div>
                </div>
            </Card>
        </div>
    )
}

const mapStateToProps = (state) => ({
    
})

export default connect(mapStateToProps)(Settings)
