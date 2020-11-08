// ******* Selectors ******
// ========================

export const getProducts = (state) => {
    return state.productsReducer.productSlice;
}