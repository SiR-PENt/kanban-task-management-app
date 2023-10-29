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
  isDeleteBoardOrTaskModalOpen: { isOpen: false, variant: '', name: ''},
  isTaskDetailsModalOpen: false, 
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
    },

    openDeleteBoardOrTaskModal: (state, { payload }) => {
      state.isDeleteBoardOrTaskModalOpen.isOpen = true
      state.isDeleteBoardOrTaskModalOpen.variant = payload.variant
      state.isDeleteBoardOrTaskModalOpen.name = payload.name

    },

    closeDeleteBoardOrTaskModal: (state) => {
      state.isDeleteBoardOrTaskModalOpen.isOpen = false
      state.isDeleteBoardOrTaskModalOpen.variant = ''
      state.isDeleteBoardOrTaskModalOpen.name = ''
    },

    openTaskDetailsModal: (state) => {
      state.isTaskDetailsModalOpen = true
    },

    closeTaskDetailsModal: (state) => {
      state.isTaskDetailsModalOpen = false
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
  openDeleteBoardOrTaskModal,
  closeDeleteBoardOrTaskModal,
  openTaskDetailsModal,
  closeTaskDetailsModal,
} = modals.actions;

export const getNavModalValue = (state: RootState) => state.modals.isNavModalOpen;
export const getAddOrEditBoardModalValue = (state: RootState) => state.modals.isAddOrEditBoardModalOpen.isOpen;
export const getAddOrEditBoardModalVariantValue = (state: RootState) => state.modals.isAddOrEditBoardModalOpen.variant;
export const getAddOrEditTaskModalValue = (state: RootState) => state.modals.isAddOrEditTaskModalOpen.isOpen;
export const getAddOrEditTaskModalVariantValue = (state: RootState) => state.modals.isAddOrEditTaskModalOpen.variant;
export const getDeleteBoardOrTaskModalValue = (state: RootState) => state.modals.isDeleteBoardOrTaskModalOpen.isOpen;
export const getDeleteBoardOrTaskModalVariantValue = (state: RootState) => state.modals.isDeleteBoardOrTaskModalOpen.variant;
export const getDeleteBoardOrTaskModalNameValue = (state: RootState) => state.modals.isDeleteBoardOrTaskModalOpen.name;
export const getTaskDetailsModalValue = (state: RootState) => state.modals.isTaskDetailsModalOpen;
export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
