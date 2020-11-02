import { createReducer } from '@reduxjs/toolkit'

const modals = createReducer({
    show: {
      AddProduct: false,
      EditMultipleProducts: false,
      UpdateProduct: false
    },
    currentProduct: {}
  }, 
  {
  TOGGLE_SHOW: (state, action) => {
    state.show[action.payload] = !state.show[action.payload]
  },
  SET_CURRENT_PRODUCT: (state, action) => {
    state.currentProduct = action.payload
  }
})

export default modals;