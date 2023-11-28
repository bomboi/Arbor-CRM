export const getUsers = state => {
    return state.usersReducers.usersSlice.users;
}

export const areUsersInitialized = state => {
    return state.usersReducers.usersSlice.initialized;
}

export const isModalVisible = (state, modal) => state.usersReducers.modalSlice.show[modal];