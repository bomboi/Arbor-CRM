export const isModalVisible = (state, modal) => {
    return state.customersReducers.modalSlice.show[modal];
}

export const getCustomers = state => {
    return state.customersReducers.customerSlice.customers;
}

export const areCustomersInitialized = state => {
    return state.customersReducers.customerSlice.initialized;
}