import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../actions';

const customerSliceInitialState = {
    customers: [],
    initialized: false
};

export const customerSlice = createSlice({
    name: 'customerSlice', 
    initialState: customerSliceInitialState,
    reducers: {
        addCustomer: (state, action) => {
            state.customers.push(action.payload);
        },
        initCustomers: (state, action) => {
            return {
                customers: action.payload,
                initialized: true
            };
        }
    },
    extraReducers: {
        [logout]: state => ({...customerSliceInitialState})
    }
})

const modalSliceInitialState = {
    show: {
        CustomerDetailedView: false,
        AddCustomerModal: false,
    },
    currentCustomer: {}
}

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: modalSliceInitialState,
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        }
    },
    extraReducers: {
        [logout]: state => ({...modalSliceInitialState})
    }
});

const customersReducer = combineReducers({
    modalSlice: modalSlice.reducer,
    customerSlice: customerSlice.reducer
});

export default customersReducer;