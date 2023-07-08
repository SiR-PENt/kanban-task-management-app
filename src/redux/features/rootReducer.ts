import { combineReducers } from '@reduxjs/toolkit';
import modalReducer from './modalSlice'

export const rootReducer = combineReducers({
    modals: modalReducer,
  });