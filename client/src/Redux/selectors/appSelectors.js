export const getUser = state => {
    return state.appReducers.userSlice;
}

export const getUserRole = state => {
    return state.appReducers.userSlice?state.appReducers.userSlice.role:undefined;
}

export const isAdmin = state => {
    let role = state.appReducers.userSlice?state.appReducers.userSlice.role:undefined;
    return role === 'admin';
}

export const loggedInUser = state => {
    return state.appReducers.userSlice;
}