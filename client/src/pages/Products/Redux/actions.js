import { createAction } from  '@reduxjs/toolkit'

export const toggleSelectedProduct = createAction('TOGGLE_SELECT_PRODUCT')
export const toggleSelectAllProducts = createAction('TOGGLE_SELECT_ALL_PRODUCTS')

export const addProducts = createAction('ADD_PRODUCTS')
export const initProducts = createAction('INIT_PRODUCTS')
export const updateProduct = createAction('UPDATE_PRODUCT')

export const toggleShowModal = createAction('TOGGLE_SHOW')
export const setCurrentProduct = createAction('SET_CURRENT_PRODUCT')