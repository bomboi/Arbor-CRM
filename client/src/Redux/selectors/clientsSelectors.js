export const getClients = state => {
    return state.clientsReducers.clientsSlice.clients;
}

export const areClientsInitialized = state => {
    return state.clientsReducers.clientsSlice.initialized;
}