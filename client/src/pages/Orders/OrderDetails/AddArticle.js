import React, { useState } from 'react'
import { Button, Card, PageHeader, Tabs, message } from 'antd';
import AddMaterials from './AddMaterials';
import AddArticleDescription from './AddArticleDescription';
import { connect } from 'react-redux';
import { newOrderArticlesSlice, newOrderNewArticleSlice } from '@reducers/ordersReducers';
import { getNewOrderNewArticle } from '@selectors/ordersSelectors';
import Modal from 'antd/lib/modal/Modal';

const { TabPane } = Tabs;

const AddArticle = (props) => {

    const isArticleOk = () => {
        if(props.currentArticle.name === undefined) return false;
        if(props.currentArticle.description === undefined) return false;
        if(props.currentArticle.price === undefined) return false;
        if(props.currentArticle.quantity === undefined) return false;
        return true;
    }

    const addToList = () => {
        if(isArticleOk()) {
            props.dispatch(newOrderArticlesSlice.actions.addArticle(props.currentArticle));
            props.dispatch(newOrderNewArticleSlice.actions.clearArticle());
        }
        else {
            message.error('Niste uneli sve podatke da biste dodali artikl!')
        }
    }

    return (
        <Modal
            visible={props.visible}
            width={1200}
            okText={props.edit?'Izmeni artikl':'Dodaj artikl'}
            onOk={()=>{
                if(props.edit) {
                    props.dispatch(newOrderArticlesSlice.actions.editArticle({article: props.currentArticle, index: props.index}))
                }
                else {
                    addToList() 
                }
                props.onCancel();
            }}
            onCancel={props.onCancel}
            closable = {false}
            cancelText={'Zatvori'}
            >
            <PageHeader
                ghost={true}
                title="Artikl"
                className="p-0"
                extra={[
                    <Button key="1">Cenovnik</Button>,
                ]}/>
            <Tabs centered>
                <TabPane tab="Opis artikla" key="1">
                    <AddArticleDescription/>
                </TabPane>
                <TabPane tab="Stofovi" key="2">
                    <AddMaterials/>
                </TabPane>
            </Tabs>
        </Modal>
    )
}

const mapStateToProps = (state) => ({
    currentArticle: getNewOrderNewArticle(state)
})

export default connect(mapStateToProps)(AddArticle)
