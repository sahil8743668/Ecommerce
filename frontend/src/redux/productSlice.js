import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';

export const fetchProducts = createAsyncThunk('product/fetchAll', async (params, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products', { params });
    return data;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchProduct = createAsyncThunk('product/fetchOne', async (id, { rejectWithValue }) => {
  try {
    const { data } = await api.get(`/products/${id}`);
    return data.product;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

export const fetchFeatured = createAsyncThunk('product/featured', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/products/featured');
    return data.products;
  } catch (err) { return rejectWithValue(err.response?.data?.message); }
});

const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [], product: null, featured: [],
    totalCount: 0, loading: false, error: null,
  },
  reducers: { clearProductError(state) { state.error = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, s => { s.loading = true; })
      .addCase(fetchProducts.fulfilled, (s, a) => { s.loading = false; s.products = a.payload.products; s.totalCount = a.payload.totalCount; })
      .addCase(fetchProducts.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchProduct.pending, s => { s.loading = true; s.product = null; })
      .addCase(fetchProduct.fulfilled, (s, a) => { s.loading = false; s.product = a.payload; })
      .addCase(fetchProduct.rejected, (s, a) => { s.loading = false; s.error = a.payload; })
      .addCase(fetchFeatured.fulfilled, (s, a) => { s.featured = a.payload; });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
