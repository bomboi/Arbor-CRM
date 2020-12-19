import { createSlice, combineReducers, createAction } from '@reduxjs/toolkit';
import moment from 'moment';
import { logout } from '../actions';

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
            let customer = action.payload.customer?action.payload.customer:action.payload;
            return {
                customer,
                existingCustomer: true,
                changedExistingCustomer: false,
                delivery: action.payload.delivery !== undefined ? action.payload.delivery:true
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
        [clearNewOrder]: state => ({...customerSliceInitialState}),
        [logout]: state => ({...customerSliceInitialState})
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
        },
        setArticle: (state, action) => {
            return ({article:{...action.payload}, currentMaterial: {}});
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({...newArticleSliceInitialState, article: {...newArticleSliceInitialState.article}}),
        [logout]: state => ({...newArticleSliceInitialState, article: {...newArticleSliceInitialState.article}})
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
        },
        setOrderInfo: (state, action) => {
            console.log(action.payload.date);
            let orderInfo = {...action.payload, date: action.payload.date};
            return orderInfo;
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({paymentType: 'gotovina', discount: 0}),
        [logout]: state => ({paymentType: 'gotovina', discount: 0})
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
        editArticle: (state, action) => {
            state[action.payload.index] = action.payload.article; 
        },
        setArticles: (state, action) => {
            return action.payload;
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ([]),
        [logout]: state => ([])
    }
})

export const orderDetails = createSlice({
    name: 'orderDetails',
    initialState: {
        editModeInit: false
    },
    reducers: {
        initEditMode: (state, action) => {
            state.editModeInit = action.payload
        }
    },
    extraReducers: {
        [clearNewOrder]: state => ({ editModeInit: false }),
        [logout]: state => ({ editModeInit: false })
    }
})

const newOrderReducer = combineReducers({
    customerSlice: newOrderCustomerSlice.reducer,
    newArticleSlice: newOrderNewArticleSlice.reducer,
    orderInfoSlice: newOrderInfoSlice.reducer,
    addedArticles: newOrderArticlesSlice.reducer,
    orderDetailsSlice: orderDetails.reducer
})

const orderListSliceInitialState = {
    orders: [],
    lastOrderDate: null,
    selectedIds: {}
};

export const orderListSlice = createSlice({
    name: 'orderListSlice',
    initialState: orderListSliceInitialState,
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
        },
        updateOrderState: (state, action) => {
            if(action.payload.index === undefined) {
                for(let order of state.orders) {
                    if(state.selectedIds[order._id] !== undefined) order.state = action.payload.state;
                }
            }
            else state.orders[action.payload.index].state = action.payload.state;
        },
        toggleSelectOrder: (state, action) => {
            if(state.selectedIds[action.payload] === undefined) state.selectedIds[action.payload] = true;
            else delete state.selectedIds[action.payload];
        },
        unselectAll: (state) => {
            state.selectedIds = {};
        },
        deleteOrder: (state, action) => {
            if(action.payload) {
                if(state.selectedIds[action.payload]) delete state.selectedIds[action.payload];
                state.orders.splice(action.payload, 1);
            }
            else {
                for(let i = 0; i < state.orders.length;) {
                    if(state.selectedIds[state.orders[i]._id] !== undefined) {
                        state.orders.splice(i, 1);
                    }
                    else i++;
                }
            }
        }
    },
    extraReducers: {
        [logout]: state => ({...orderListSliceInitialState})
    }
});

const orderPreviewSliceInitialState = {
    visible: false,
    loading: true,
    index: 0,
    data: null,
    versions: []
};

export const orderPreviewSlice = createSlice({
    name: 'orderPreviewSlice',
    initialState: orderPreviewSliceInitialState,
    reducers:{
        toggleShow: state => {
            state.visible = !state.visible
        },
        setData: (state, action) => {
            state.data = action.payload
        },
        setIndex: (state, action) => {
            state.index = action.payload
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
    },
    extraReducers: {
        [logout]: state => ({...orderListSliceInitialState})
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