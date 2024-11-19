import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
    loading: false,
    error: null,
    products: [],
    product: null,
    pagination: {},
    favouritesToggled: true,
};

export const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setLoading: (state) => {
            state.loading = true;
        },
        setProducts: (state, { payload }) => {
            state.loading = false;
            state.error = null;
            state.products = payload;
        },
        setError: (state, { payload }) => {
            state.loading = false;
            state.error = payload;
        },
        setPagination: (state, { payload }) => {
            state.loading = false;
            state.error = null;
            state.pagination = payload;
        },

    },
})

export const {
    setLoading, setError, setProducts, setPagination
} = productSlice.actions;

export default productSlice.reducer;

export const productSelector = (state) => state.products;