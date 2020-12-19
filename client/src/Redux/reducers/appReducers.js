import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../actions';

export const userSlice = createSlice({
    name: 'userSlice',
    initialState: {},
    reducers: {
        initUser: (state, action) => {
            return action.payload;
        },
        userInitialized: (state, action) => {
            action.payload(false);
        },
        logoutUser: (state, action) => {
            return {};
        }
    },
    extraReducers: {
        [logout]: state => ({})
    }
}); 

export const appSettingsSlice = createSlice({
    name: 'appSettingsSlice',
    initialState: {},
    reducers: {
        initApp: (state, action) => {
            return action.payload;
        }
    },
    extraReducers: {
        [logout]: state => ({})
    }
})

const appReducer = combineReducers({
    userSlice: userSlice.reducer,
    appSettingsSlice: appSettingsSlice.reducer
})

export default appReducer;