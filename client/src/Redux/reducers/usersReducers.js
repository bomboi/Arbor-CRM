import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../actions';

const usersSliceInitialState = {
    users: [],
    initialized: false
};

export const usersSlice = createSlice({
    name: 'usersSlice', 
    initialState: usersSliceInitialState,
    reducers: {
        addUser: (state, action) => {
            state.users.push(action.payload);
        },
        updateUser: (state, action) => {
            let index = state.users.findIndex(item => item._id === action.payload._id);
            state.users[index] = action.payload;
        },
        removeUser: (state, action) => {
            let index = state.users.findIndex(item => item._id === action.payload);
            state.users.splice(index, 1);
        },
        initUsers: (state, action) => {
            return {
                users: action.payload,
                initialized: true
            };
        },
        toggleActive: (state, action) => {
            let index = state.users.findIndex(item => item._id === action.payload._id);
            state.users[index].active = action.payload.active;
        }
    },
    extraReducers: {
        [logout]: state => ({...usersSliceInitialState})
    }
})

const modalSliceInitialState = {
    show: {
        AddUser: false,
        UpdateUser: false
    },
    currentUser: {}
}

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: modalSliceInitialState,
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
        },
        setCurrentUser: (state, action) => {
            state.currentUser = action.payload
        }
    },
    extraReducers: {
        [logout]: state => ({...modalSliceInitialState})
    }
});

const usersReducer = combineReducers({
    usersSlice: usersSlice.reducer,
    modalSlice: modalSlice.reducer
});

export default usersReducer;