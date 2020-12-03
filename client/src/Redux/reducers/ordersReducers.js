import { createSlice, combineReducers, createAction } from '@reduxjs/toolkit';

export const clearNewOrder = createAction('clearNewOrder');

const customerSliceInitialState = {
    customer: {},
    existingCustomer: false,
    changedExistingCustomer: false,
    delivery: true
}

export const newOrderCustomerSlice = createSlice({
    name: 'newOrderCustomerSlice',
    initialState: customerSliceInitialState,
    reducers: {
        setCustomer: (state, action) => {
            let {__v, orders, comments, ...customer} = action.payload;
            return {
                customer,
                existingCustomer: true,
                changedExistingCustomer: false,
                delivery: true
            };
        },
        updateCustomer: (state, action) => {
            // Check if exists on server side, when name is changed ?
            if(state.existingCustomer) {
                state.changedExistingCustomer = true;
            }
            if(action.payload.address) {
                if(state.customer.address === undefined) state.customer.address = {elevator:false};
                state.customer.address[action.payload.key] = action.payload.value;
            }
            else state.customer[action.payload.key] = action.payload.value;
        },
        toggleDelivery: (state, action) => {
            state.delivery = action.payload;
        },
        newFromExisting: (state, action) => {
            delete state.customer._id;
            state.existingCustomer = false;
            state.changedExistingCustomer = false;
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({...customerSliceInitialState})
    }
})

const newArticleSliceInitialState = {
    article: {quantity: 1, discount: 0, materials: []},
    currentMaterial: {}
};

export const newOrderNewArticleSlice = createSlice({
    name: 'newOrderNewArticleSlice',
    initialState: newArticleSliceInitialState,
    reducers: {
        clearArticle: (state, action) => {
            return ({...newArticleSliceInitialState});
        },
        updateArticle: (state, action) => {
            state.article[action.payload.key] = action.payload.value;
        },
        updateCurrentMaterial: (state, action) => {
            state.currentMaterial[action.payload.key] = action.payload.value;
        },
        addMaterial: (state, action) => {
            state.article.materials.push(state.currentMaterial);
            state.currentMaterial = {};
        },
        removeMaterial: (state, action) => {
            state.article.materials.splice(action.payload, 1);
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({...newArticleSliceInitialState, article: {...newArticleSliceInitialState.article}})
    }
})

export const newOrderInfoSlice = createSlice({
    name: 'newOrderInfoSlice',
    initialState: {
        paymentType: 'gotovina',
        discount: 0
    },
    reducers: {
        updateOrderInfo: (state, action) => {
            state[action.payload.key] = action.payload.value;
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({paymentType: 'gotovina', discount: 0})
    }
})

export const newOrderArticlesSlice = createSlice({
    name: 'newOrderArticlesSlice',
    initialState: [],
    reducers: {
        addArticle: (state, action) => {
            state.push(action.payload);
        },
        removeArticle: (state, action) => {
            state.splice(action.payload, 1);
        },
        setArticles: (state, action) => {
            return action.payload;
        }
    },
    extraReducers: {
        [clearNewOrder]: state => []
    }
})

const newOrderReducer = combineReducers({
    customerSlice: newOrderCustomerSlice.reducer,
    newArticleSlice: newOrderNewArticleSlice.reducer,
    orderInfoSlice: newOrderInfoSlice.reducer,
    addedArticles: newOrderArticlesSlice.reducer
})

export const orderListSlice = createSlice({
    name: 'orderListSlice',
    initialState: {
        orders: [],
        lastOrderDate: null
    },
    reducers: {
        update: (state, action) => {
            console.log('UPDATE')
            if(action.payload.length > 0) {
                state.orders = state.orders.concat(action.payload)
                console.log(action.payload)
                state.lastOrderDate = action.payload[action.payload.length - 1].latestVersionData.data.orderInfo.date;
            }
        },
        init: (state, action) => {
            console.log('INIT')
            state.orders = action.payload;
            console.log(action.payload)
            if(action.payload.length > 0) state.lastOrderDate = action.payload[action.payload.length - 1].latestVersionData.data.orderInfo.date;
            else state.lastOrderDate = null;
        }
    }
});

export const orderPreviewSlice = createSlice({
    name: 'orderPreviewSlice',
    initialState: {
        visible: false,
        loading: true,
        data: null,
        versions: []
    },
    reducers:{
        toggleShow: state => {
            state.visible = !state.visible
        },
        setData: (state, action) => {
            state.data = action.payload
        },
        initVersions: (state, action) => {
            console.log('initVersions');
            state.versions = action.payload;
        },
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        postComment: (state, action) => {
            state.data.comments.push(action.payload);
        }
    }  
})

const orderManagementReducer = combineReducers({
    orderListSlice: orderListSlice.reducer,
    orderPreviewSlice: orderPreviewSlice.reducer
})

const ordersReducers = combineReducers({
    newOrderReducer,
    orderManagementReducer
})

export default ordersReducers;