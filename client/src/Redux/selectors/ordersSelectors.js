/* ===== Section: New Order ====== */

// Customer Slice
export const getNewOrderCustomer = state => state.ordersReducers.newOrderReducer.customerSlice.customer;
export const isExistingCustomer = state => state.ordersReducers.newOrderReducer.customerSlice.existingCustomer;
export const isExistingCustomerChanged = state => state.ordersReducers.newOrderReducer.customerSlice.changedExistingCustomer;
export const usingDelivery = state => state.ordersReducers.newOrderReducer.customerSlice.delivery;

// New Article Slice
export const getNewOrderNewArticle = state => state.ordersReducers.newOrderReducer.newArticleSlice.article;
export const getCurrentMaterial = state => state.ordersReducers.newOrderReducer.newArticleSlice.currentMaterial;
export const getArticleMaterials = state => state.ordersReducers.newOrderReducer.newArticleSlice.article.materials;

// Order Info Slice
export const getOrderInfo = state => state.ordersReducers.newOrderReducer.orderInfoSlice;
export const getAvans = state => state.ordersReducers.newOrderReducer.orderInfoSlice.avans;
export const getGlobalDiscount = state => state.ordersReducers.newOrderReducer.orderInfoSlice.discount;
export const getDeliveryPrice = state => state.ordersReducers.newOrderReducer.orderInfoSlice.deliveryPrice;

// Added Articles Slice
export const getAddedArticles = state => state.ordersReducers.newOrderReducer.addedArticles;

export const isEditModeInitialized = state => state.ordersReducers.newOrderReducer.orderDetailsSlice.editModeInit;

/* ===== Section: Order List ====== */

export const getOrderList = state => state.ordersReducers.orderManagementReducer.orderListSlice.orders;
export const getLastOrderDate = state => state.ordersReducers.orderManagementReducer.orderListSlice.lastOrderDate;
export const isOrderChecked = (state, index) => state.ordersReducers.orderManagementReducer.orderListSlice.selectedIds[state.ordersReducers.orderManagementReducer.orderListSlice.orders[index]._id] !== undefined;
export const getSelectedIds = (state) => state.ordersReducers.orderManagementReducer.orderListSlice.selectedIds;


export const isOrderPreviewVisible = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.visible;
export const getOrderPreviewData = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.data;
export const getOrderPreviewVersions = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.versions;
export const isOrderPreviewLoading = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.loading;
export const getOrderPreviewId = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.data._id;
export const getOrderPreviewIndex = state => state.ordersReducers.orderManagementReducer.orderPreviewSlice.index;