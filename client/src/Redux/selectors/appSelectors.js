export const getUser = state => state.appReducers.userSlice;

export const getUserRole = state => state.appReducers.userSlice?state.appReducers.userSlice.role:undefined;

export const isAdmin = state => {
    let role = state.appReducers.userSlice?state.appReducers.userSlice.role:undefined;
    return role === 'admin';
}

export const loggedInUser = state => state.appReducers.userSlice;

export const getOrderDefaults = state => state.appReducers.orderDefaultsSlice;