// ******* Selectors ******
// ========================

export const getProducts = (state) => state.productsReducers.productSlice;

export const getCurrentProduct = (state) => state.productsReducers.modalSlice.currentProduct;

export const areAllSelected = (state) => Object.keys(state.productsReducers.selectProductSlice).length === getProducts(state).length;

export const isProductSelected = (state, id) => state.productsReducers.selectProductSlice[id] !== undefined;

export const isModalVisible = (state, modal) => state.productsReducers.modalSlice.show[modal];

export const selectedProducts = state => Object.keys(state.productsReducers.selectProductSlice);