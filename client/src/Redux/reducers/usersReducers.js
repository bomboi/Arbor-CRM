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
        removeUser: (state, action) => {
            state.users.splice(action.payload, 1);
        },
        initUsers: (state, action) => {
            return {
                users: action.payload,
                initialized: true
            };
        },
        toggleActive: (state, action) => {
            console.log(action.payload);
            state.users[action.payload.index].active = action.payload.active
        }
    },
    extraReducers: {
        [logout]: state => ({...usersSliceInitialState})
    }
})

const modalSliceInitialState = {
    show: {
        AddUser: false,
    }
}

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: modalSliceInitialState,
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
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