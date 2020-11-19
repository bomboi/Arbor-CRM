import { createSlice, combineReducers } from '@reduxjs/toolkit';

export const customerSlice = createSlice({
    name: 'customerSlice', 
    initialState: {
        customers: [],
        initialized: false
    },
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
    }
})

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: 
    {
        show: {
            CustomerDetailedView: false,
            AddCustomerModal: false,
        },
        currentCustomer: {}
    },
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        }
    }
});

const customersReducer = combineReducers({
    modalSlice: modalSlice.reducer,
    customerSlice: customerSlice.reducer
});

export default customersReducer;