import { configureStore } from '@reduxjs/toolkit'
import productsReducers from './reducers/productsReducers';
import appReducers from './reducers/appReducers';
import customersReducers from './reducers/customersReducers';
import ordersReducers from './reducers/ordersReducers';


const store = configureStore({
  reducer: {
    productsReducers,
    appReducers,
    customersReducers,
    ordersReducers
  }
})

export default store;