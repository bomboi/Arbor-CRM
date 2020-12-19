import { createSlice, combineReducers } from '@reduxjs/toolkit'
import { logout } from '../actions';

// ******* Reducers *******
// ========================

export const productSlice = createSlice({
    name: 'productsSlice',
    initialState: [],
    reducers: {
        addProducts: (state, action) => {
            if(Array.isArray(action.payload)) state.push(...action.payload)
            else state.push(action.payload)
            state.sort((a,b)=>(a.productName).localeCompare(b.productName))
        },
        initProducts: (state, action) => {
            return [...action.payload].sort((a,b)=>(a.productName).localeCompare(b.productName));
        },
        updateProduct: (state, action) => {
            let index = state.findIndex(item => item._id === action.payload._id);
            state[index] = action.payload;
        }
    },
    extraReducers: {
        [logout]: state => ([])
    }
});

const modalSliceInitialState = {
    show: {
        AddProduct: false,
        EditMultipleProducts: false,
        UpdateProduct: false
    },
    currentProduct: {}
}

export const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: modalSliceInitialState,
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        }
    },
    extraReducers: {
        [logout]: state => ({...modalSliceInitialState})
    }
});

export const selectProductSlice = createSlice({
    name: 'selectProductSlice',
    initialState: {},
    reducers: {
        toggleSelectProduct: (state, action) => {
            if(state[action.payload] !== undefined) {
                delete state[action.payload];
            }
            else {
                state[action.payload] = true;
            }
        },
        toggleSelectAllProducts: (state, action) => {
            if(Object.keys(state).length < action.payload.length) {
                console.log('SELECT ALL')
                for(let item of action.payload)
                    state[item._id] = true;
            }
            else if(Object.keys(state).length === action.payload.length) {
                console.log('UNSELECT ALL')
                return {};
            }
        }
    },
    extraReducers: {
        [logout]: state => ({})
    }
});

const productsReducer = combineReducers({
    modalSlice: modalSlice.reducer,
    productSlice: productSlice.reducer,
    selectProductSlice: selectProductSlice.reducer
});

export default productsReducer;