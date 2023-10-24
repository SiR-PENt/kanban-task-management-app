import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
    [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,
  pageTitle: '',
  isAddOrEditBoardModalOpen: { isOpen: false, variant: ''},
  isAddOrEditTaskModalOpen: { isOpen: false, variant: ''},
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

    openAddOrEditBoardModal: (state, { payload }) => {
      state.isNavModalOpen = false
      state.isAddOrEditBoardModalOpen.isOpen = true
      state.isAddOrEditBoardModalOpen.variant = payload
    },

    closeAddOrEditBoardModal: (state) => {
      state.isAddOrEditBoardModalOpen.isOpen = false
      state.isAddOrEditBoardModalOpen.variant = ''
    },
    
    openAddOrEditTaskModal: (state, { payload }) => {
      state.isAddOrEditTaskModalOpen.isOpen = true
      state.isAddOrEditTaskModalOpen.variant = payload
    },

    closeAddOrEditTaskModal: (state) => {
      state.isAddOrEditTaskModalOpen.isOpen = false
      state.isAddOrEditTaskModalOpen.variant = ''
    } 
  },
});

export const {
  openNavModal,
  closeNavModal,
  setPageTitle,
  openAddOrEditBoardModal,
  closeAddOrEditBoardModal,
  openAddOrEditTaskModal,
  closeAddOrEditTaskModal,
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.isNavModalOpen;
export const getAddOrEditBoardModalValue = (state: RootState) => state.modals.isAddOrEditBoardModalOpen.isOpen;
export const getAddOrEditBoardModalVariantValue = (state: RootState) => state.modals.isAddOrEditBoardModalOpen.variant;
export const getAddOrEditTaskModalValue = (state: RootState) => state.modals.isAddOrEditTaskModalOpen.isOpen;
export const getAddOrEditTaskModalVariantValue = (state: RootState) => state.modals.isAddOrEditTaskModalOpen.variant;
export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
