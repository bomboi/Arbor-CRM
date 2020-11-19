// ******* Selectors ******
// ========================

export const getProducts = (state) => {
    return state.productsReducers.productSlice;
}

export const getCurrentProduct = (state) => {
    return state.productsReducers.modalSlice.currentProduct;
}

export const areAllSelected = (state) => {
    return Object.keys(state.productsReducers.selectProductSlice).length === getProducts(state).length;
}

export const isProductSelected = (state, id) => {
    return state.productsReducers.selectProductSlice[id] !== undefined;
}

export const isModalVisible = (state, modal) => {
    return state.productsReducers.modalSlice.show[modal];
}