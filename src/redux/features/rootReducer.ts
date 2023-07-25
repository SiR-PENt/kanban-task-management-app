import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modalSlice'
import userReducer from './userSlice'

export const rootReducer = combineReducers({
    modals: modalReducer,
    user: userReducer
  });