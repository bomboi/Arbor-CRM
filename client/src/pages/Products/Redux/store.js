import { configureStore } from '@reduxjs/toolkit'
import modalReducer from './reducers/modalReducer'
import selectProductsReducer from './reducers/selectProductsReducer'
import productsReducer from './reducers/productsReducer';

const store = configureStore({
  reducer: {
    modal: modalReducer,
    selectProducts: selectProductsReducer,
    products: productsReducer
  }
})

export default store