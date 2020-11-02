import { createReducer } from '@reduxjs/toolkit'

const productsReducer = createReducer([], {
    ADD_PRODUCTS: (state, action) => {
        if(Array.isArray(action.payload)) state.push(...action.payload)
        else state.push(action.payload)
        state.sort((a,b)=>(a.productName).localeCompare(b.productName))
    },
    INIT_PRODUCTS: (state, action) => {
        return [...action.payload].sort((a,b)=>(a.productName).localeCompare(b.productName));
    },
    UPDATE_PRODUCT: (state, action) => {
        let index = state.findIndex(item => item._id === action.payload._id);
        state[index] = action.payload;
    }
  })

export default productsReducer;