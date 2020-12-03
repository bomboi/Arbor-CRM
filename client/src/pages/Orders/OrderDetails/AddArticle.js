import React, { useState } from 'react'
import { Button, Card, PageHeader, Tabs, message } from 'antd';
import AddMaterials from './AddMaterials';
import AddArticleDescription from './AddArticleDescription';
import { connect } from 'react-redux';
import { newOrderArticlesSlice, newOrderNewArticleSlice } from '@reducers/ordersReducers';
import { getNewOrderNewArticle } from '@selectors/ordersSelectors';

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
        <Card className='mb-3'>
            <PageHeader
                ghost={true}
                title="Artikl"
                className="p-0"
                extra={[
                    <Button key="1">Cenovnik</Button>,
                    <Button key="2" onClick={addToList} type="primary">Dodaj u porudzbinu</Button>,
                ]}/>
            <Tabs centered>
                <TabPane tab="Opis artikla" key="1">
                    <AddArticleDescription/>
                </TabPane>
                <TabPane tab="Stofovi" key="2">
                    <AddMaterials/>
                </TabPane>
            </Tabs>
        </Card>
    )
}

const mapStateToProps = (state) => ({
    currentArticle: getNewOrderNewArticle(state)
})

export default connect(mapStateToProps)(AddArticle)
