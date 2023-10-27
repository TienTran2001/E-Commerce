import { createAsyncThunk } from '@reduxjs/toolkit';
import { apiGetCategories } from '../apis';

export const getCategories = createAsyncThunk(
  'categories/get',
  async (data, { rejectWithValue }) => {
    // Gọi lên API backend
    const response = await apiGetCategories();

    if (!response.success) return rejectWithValue(response.categories);
    return response.categories;
  }
);
