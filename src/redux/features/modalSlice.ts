import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
    [key: string]: any;
};

const initialState: CounterState = {
  navModal: false,
  pageTitle: ''
} 

export const modals = createSlice({
  name: "modals",
  initialState,
  reducers: {

    openNavModal: (state) => {
        state.navModal = true
    },

    closeNavModal: (state) => {
        state.navModal = false
    },

    setPageTitle: (state, {payload}) => {
        state.pageTitle = payload
    },
  },
});

export const {
  openNavModal,
  closeNavModal,
  setPageTitle,
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.navModal;
export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
