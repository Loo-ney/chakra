import {createSlice} from '@reduxjs/toolkit';

export const initialState = {
    loading: false,
    error: null,
    products: [],
    product: null,
    pagination: {},
    favoritesToggled: false,
    reviewed: false,
    favorites: JSON.parse(localStorage.getItem('favorites')) ?? [], 
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
            state.reviewRemoval = false;
        },
        setProduct: (state, { payload }) => {
            state.product = payload;
            state.loading = false;
            state.error = null;
            state.reviewed = false;
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
        setFavorites: (state, {payload}) => {
            state.favorites = payload;
        },
        setFavoritesToggle: (state, {payload}) => {
            state.favoritesToggled = payload;
        },
        productReviewed: (state, { payload }) => {
			state.loading = false;
			state.error = null;
			state.reviewed = payload;
		},

    },
})

export const {
    setLoading, 
    setError, 
    setProducts, 
    setPagination,
    setFavorites,
    setFavoritesToggle,
    setProduct,
    productReviewed,
} = productSlice.actions;

export default productSlice.reducer;

export const productSelector = (state) => state.products;