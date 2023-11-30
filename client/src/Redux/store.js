import { configureStore, createAction } from '@reduxjs/toolkit'
import productsReducers from './reducers/productsReducers';
import appReducers from './reducers/appReducers';
import customersReducers from './reducers/customersReducers';
import ordersReducers from './reducers/ordersReducers';
import clientsReducers from './reducers/clientsReducers';
import usersReducers from './reducers/usersReducers';

const store = configureStore({
  reducer: {
    productsReducers,
    appReducers,
    customersReducers,
    ordersReducers,
    clientsReducers,
    usersReducers,
  }
})

export default store;