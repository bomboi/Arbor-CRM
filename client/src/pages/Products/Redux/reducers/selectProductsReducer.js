import { createReducer } from '@reduxjs/toolkit'

const selectProductsReducer = createReducer({}, {
    TOGGLE_SELECT_PRODUCT: (state, action) => {
        if(state[action.payload] !== undefined) {
            delete state[action.payload];
        }
        else {
            state[action.payload] = true;
        }
    },
    TOGGLE_SELECT_ALL_PRODUCTS: (state, action) => {
        if(Object.keys(state).length < action.payload.length) {
            console.log('SELECT ALL')
            for(let item of action.payload)
                state[item._id] = true;
        }
        else if(Object.keys(state).length === action.payload.length) {
            console.log('UNSELECT ALL')
            return {};
        }
    }
  })

export default selectProductsReducer;