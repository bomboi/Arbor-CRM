export const getNewOrderCustomer = state => state.ordersReducers.newOrderReducer.customerSlice.customer;
export const isExistingCustomer = state => state.ordersReducers.newOrderReducer.customerSlice.existingCustomer;
export const isExistingCustomerChanged = state => state.ordersReducers.newOrderReducer.customerSlice.changedExistingCustomer;
export const usingDelivery = state => state.ordersReducers.newOrderReducer.customerSlice.delivery;