import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
    [key: string]: any;
};

const initialState: CounterState = {
  navModal: false,
} 

export const modals = createSlice({
  name: "modals",
  initialState,
  reducers: {

    reset: () => initialState,

    openNavModal: (state) => {
        state.navModal = true
    },

    closeNavModal: (state) => {
        state.navModal = false
    },

  },
});

export const {
  reset,
  openNavModal,
  closeNavModal,
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.navModal;

export default modals.reducer;
