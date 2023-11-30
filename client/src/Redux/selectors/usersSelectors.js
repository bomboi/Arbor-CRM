export const getUsers = state => state.usersReducers.usersSlice.users;

export const areUsersInitialized = state => state.usersReducers.usersSlice.initialized;

export const getCurrentUser = (state) => state.usersReducers.modalSlice.currentUser;

export const isModalVisible = (state, modal) => state.usersReducers.modalSlice.show[modal];