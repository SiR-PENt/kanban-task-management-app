import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
    [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,
  pageTitle: '',
  isAddBoardModalOpen: false,
  isEditBoardModalOpen: false,
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

    openAddBoardModal: (state) => {
      state.isNavModalOpen = false
      state.isAddBoardModalOpen = true
    },

    closeAddBoardModal: (state) => {
      state.isAddBoardModalOpen = false
    },

    openEditBoardModal: (state) => {
      state.isEditBoardModalOpen = true
    },

    closeEditBoardModal: (state) => {
      state.isEditBoardModalOpen = false
    },

  },
});

export const {
  openNavModal,
  closeNavModal,
  setPageTitle,
  openAddBoardModal,
  closeAddBoardModal,
  closeEditBoardModal
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.isNavModalOpen;
export const getAddBoardModalValue = (state: RootState) => state.modals.isAddBoardModalOpen;
export const getEditBoardModalValue = (state: RootState) => state.modals.isEditBoardModalOpen;
export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
