import { createSlice } from '@reduxjs/toolkit';
import * as actions from './asyncActions';

const initialState = {
    categories: [],
    loading: false,
    // errorMessage: '',
};

export const categorySlice = createSlice({
    name: 'categories',
    initialState,
    // Reducers chứa các hàm xử lý cập nhật state
    reducers: {},
    // Code logic xử lý async action
    extraReducers: (builder) => {
        // Bắt đầu thực hiện action get categories (Promise pending)
        builder.addCase(actions.getCategories.pending, (state) => {
            // Bật trạng thái loading
            state.isLoading = true;
        });

        // Khi thực hiện action get categories thành công (Promise fulfilled)
        builder.addCase(actions.getCategories.fulfilled, (state, action) => {
            // Tắt trạng thái loading, lưu thông tin categories vào store
            state.isLoading = false;
            state.categories = action.payload;
        });

        // Khi thực hiện action get categories thất bại (Promise rejected)
        builder.addCase(actions.getCategories.rejected, (state, action) => {
            // Tắt trạng thái loading, lưu thông báo lỗi vào store
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});

// Export action ra để sử dụng cho tiện.
export const {} = categorySlice.actions;

// Export reducer để nhúng vào Store
export default categorySlice.reducer;
