import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './reducers/productsReducers';


const store = configureStore({
  reducer: {
    productsReducer,
  }
})

export default store;