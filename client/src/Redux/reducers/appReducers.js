import { createSlice, combineReducers } from '@reduxjs/toolkit';

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: {},
    reducers: {
        initUser: (state, action) => {
            return action.payload;
        },
        logoutUser: (state, action) => {
            return {};
        }
    }
}); 

export const appSettingsSlice = createSlice({
    name: 'appSettingsSlice',
    initialState: {},
    reducers: {
        initApp: (state, action) => {
            return action.payload;
        }
    }
})

const appReducer = combineReducers({
    userSlice: userSlice.reducer,
    appSettingsSlice: appSettingsSlice.reducer
})

export default appReducer;