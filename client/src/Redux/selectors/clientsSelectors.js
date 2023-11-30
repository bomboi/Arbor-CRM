export const getClients = state => {
    return state.clientsReducers.clientsSlice.clients;
}

export const areClientsInitialized = state => {
    return state.clientsReducers.clientsSlice.initialized;
}

export const isModalVisible = (state, modal) => state.clientsReducers.modalSlice.show[modal];