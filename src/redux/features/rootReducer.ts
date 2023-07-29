import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modalSlice'
import userReducer from './userSlice'
import { fireStoreApi } from '../services/apiSlice';

export const rootReducer = combineReducers({
    modals: modalReducer,
    user: userReducer,
    [fireStoreApi.reducerPath]: fireStoreApi.reducer,
  });