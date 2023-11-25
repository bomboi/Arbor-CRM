import { createSlice, combineReducers } from '@reduxjs/toolkit';
import { logout } from '../actions';

const clientsSliceInitialState = {
    clients: [],
    initialized: false
};

export const clientsSlice = createSlice({
    name: 'clientsSlice', 
    initialState: clientsSliceInitialState,
    reducers: {
        addClient: (state, action) => {
            state.clients.push(action.payload);
        },
        initClients: (state, action) => {
            return {
                clients: action.payload,
                initialized: true
            };
        },
        toggleActive: (state, action) => {
            console.log(action.payload);
            state.clients[action.payload.index].active = action.payload.active
        }
    },
    extraReducers: {
        [logout]: state => ({...clientsSliceInitialState})
    }
})

const modalSliceInitialState = {
    show: {
        AddClient: false,
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

const clientsReducer = combineReducers({
    clientsSlice: clientsSlice.reducer,
    modalSlice: modalSlice.reducer
});

export default clientsReducer;