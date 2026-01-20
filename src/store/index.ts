import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import userReducer from './slices/userSlice';
import customerReducer from './slices/customerSlice';
import orderReducer from './slices/orderSlice';
import refundReducer from './slices/refundSlice';
import shiftReportReducer from './slices/shiftReportSlice';
import branchReducer from './slices/branchSlice';
import storeReducer from './slices/storeSlice';
import productReducer from './slices/productSlice';
import inventoryReducer from './slices/inventorySlice';
import employeeReducer from './slices/employeeSlice';
import categoryReducer from './slices/categorySlice';
import branchAnalyticsReducer from './slices/branchAnalyticsSlice';
import storeAnalyticsReducer from './slices/storeAnalyticsSlice';
import subscriptionReducer from './slices/subscriptionSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
    customer: customerReducer,
    order: orderReducer,
    refund: refundReducer,
    shiftReport: shiftReportReducer,
    branch: branchReducer,
    store: storeReducer,
    product: productReducer,
    inventory: inventoryReducer,
    employee: employeeReducer,
    category: categoryReducer,
    branchAnalytics: branchAnalyticsReducer,
    storeAnalytics: storeAnalyticsReducer,
    subscription: subscriptionReducer,
    ui: uiReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
