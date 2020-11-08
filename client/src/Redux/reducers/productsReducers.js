import { createSlice, createReducer, combineReducers } from '@reduxjs/toolkit'

// ******* Reducers *******
// ========================

const productSlice = createSlice({
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
    }
});

const modalSlice = createSlice({
    name: 'modalSlice',
    initialState: 
    {
        show: {
            AddProduct: false,
            EditMultipleProducts: false,
            UpdateProduct: false
        },
        currentProduct: {}
    },
    reducers: {
        toggleShow: (state, action) => {
            state.show[action.payload] = !state.show[action.payload]
        },
        setCurrentProduct: (state, action) => {
            state.currentProduct = action.payload
        }
    }
});

const selectProductSlice = createSlice({
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
    }
});

// const productsReducer = createReducer({}, {
//     modalSlice: modalSlice.reducer,
//     productSlice,
//     selectProductSlice
// });

const productsReducer = combineReducers({
    modalSlice: modalSlice.reducer,
    productSlice: productSlice.reducer,
    selectProductSlice: selectProductSlice.reducer
});

export default productsReducer;