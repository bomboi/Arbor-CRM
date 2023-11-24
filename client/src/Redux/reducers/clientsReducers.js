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
        }
    },
    extraReducers: {
        [logout]: state => ({...clientsSliceInitialState})
    }
})

const clientsReducer = combineReducers({
    clientsSlice: clientsSlice.reducer
});

export default clientsReducer;