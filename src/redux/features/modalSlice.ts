import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
    [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,
  pageTitle: '',
  isAddBoardModalOpen: { isOpen: false, variant: ''},
} 

export const modals = createSlice({
  name: "modals",
  initialState,

  reducers: {

    openNavModal: (state) => {
        state.isNavModalOpen = true
    },

    closeNavModal: (state) => {
        state.isNavModalOpen = false
    },

    setPageTitle: (state, {payload}) => {
        state.pageTitle = payload
    },

    openAddBoardModal: (state, { payload }) => {
      state.isNavModalOpen = false
      state.isAddBoardModalOpen.isOpen = true
      state.isAddBoardModalOpen.variant = payload
    },

    closeAddBoardModal: (state) => {
      state.isAddBoardModalOpen.isOpen = false
    },

  },
});

export const {
  openNavModal,
  closeNavModal,
  setPageTitle,
  openAddBoardModal,
  closeAddBoardModal,
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.isNavModalOpen;
export const getAddBoardModalValue = (state: RootState) => state.modals.isAddBoardModalOpen.isOpen;
export const getAddOrEditBoardModalVariantValue = (state: RootState) => state.modals.isAddBoardModalOpen.variant;
export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
