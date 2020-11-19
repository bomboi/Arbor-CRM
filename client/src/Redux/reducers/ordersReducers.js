import { createSlice, combineReducers } from '@reduxjs/toolkit';

export const newOrderCustomerSlice = createSlice({
    name: 'newOrderCustomerSlice',
    initialState: {
        customer: {},
        existingCustomer: false,
        changedExistingCustomer: false,
        delivery: true
    },
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
                if(state.customer.address === undefined) state.customer.address = {};
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

    }
})

const newOrderReducer = combineReducers({
    customerSlice: newOrderCustomerSlice.reducer
})

const ordersReducers = combineReducers({
    newOrderReducer
})

export default ordersReducers;