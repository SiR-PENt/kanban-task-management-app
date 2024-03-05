import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
  [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,

  pageTitle: "",

  isAddOrEditBoardModalOpen: { isOpen: false, variant: "" },

  isAddOrEditTaskModalOpen: { isOpen: false, variant: "" },

  isDeleteBoardOrTaskModal: { 
    isOpen: false,
    variant: "",
    title: '',
    status: "",
    index: -1,  
  },

  isTaskDetailsModalOpen: {
    isOpen: false,
    title: "",
    subtasks: [],
    completedSubtasks: "",
    description: "",
  },
};

export const modals = createSlice({
  name: "modals",
  initialState,

  reducers: {
    openNavModal: (state: RootState) => {
      state.isNavModalOpen = true;
    },

    closeNavModal: (state) => {
      state.isNavModalOpen = false;
    },

    setPageTitle: (state, { payload }) => {
      state.pageTitle = payload;
    },

    openAddOrEditBoardModal: (state, { payload }) => {
      state.isNavModalOpen = false;
      state.isAddOrEditBoardModalOpen.isOpen = true;
      state.isAddOrEditBoardModalOpen.variant = payload;
    },

    closeAddOrEditBoardModal: (state) => {
      state.isAddOrEditBoardModalOpen.isOpen = false;
      state.isAddOrEditBoardModalOpen.variant = "";
    },

    openAddOrEditTaskModal: (state, { payload }) => {
      state.isAddOrEditTaskModalOpen.isOpen = true;
      state.isAddOrEditTaskModalOpen.variant = payload;
    },

    closeAddOrEditTaskModal: (state) => {
      state.isAddOrEditTaskModalOpen.isOpen = false;
      state.isAddOrEditTaskModalOpen.variant = "";
    },

    openDeleteBoardOrTaskModal: (state, { payload }) => {
      state.isDeleteBoardOrTaskModal.isOpen = true;
      state.isDeleteBoardOrTaskModal.variant = payload.variant;
      state.isDeleteBoardOrTaskModal.name = payload.name;
    },

    closeDeleteBoardOrTaskModal: (state) => {
      state.isDeleteBoardOrTaskModal.isOpen = false;
      state.isDeleteBoardOrTaskModal.variant = "";
      state.isDeleteBoardOrTaskModal.name = "";
    },

    openTaskDetailsModal: (state, { payload }) => {
      state.isTaskDetailsModalOpen.isOpen = true;
      state.isTaskDetailsModalOpen.title = payload.title;
      state.isTaskDetailsModalOpen.description = payload.description;
      state.isTaskDetailsModalOpen.subtasks = payload.subtasks;
      state.isTaskDetailsModalOpen.completedSubtasks =
        payload.completedSubtasks;
    },

    closeTaskDetailsModal: (state) => {
      state.isTaskDetailsModalOpen.isOpen = false;
      state.isTaskDetailsModalOpen.title = "";
      state.isTaskDetailsModalOpen.description = "";
      state.isTaskDetailsModalOpen.subtasks = [];
      state.isTaskDetailsModalOpen.completedSubtasks = "";
    },
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

export const getNavModalValue = (state: RootState) =>
  state.modals.isNavModalOpen;

export const getAddOrEditBoardModalValue = (state: RootState) =>
  state.modals.isAddOrEditBoardModalOpen.isOpen;

export const getAddOrEditBoardModalVariantValue = (state: RootState) =>
  state.modals.isAddOrEditBoardModalOpen.variant;

export const getAddOrEditTaskModalValue = (state: RootState) =>
  state.modals.isAddOrEditTaskModalOpen.isOpen;

export const getAddOrEditTaskModalVariantValue = (state: RootState) =>
  state.modals.isAddOrEditTaskModalOpen.variant;

// Delete functionality
export const getDeleteBoardOrTaskModalValue = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.isOpen;

export const getDeleteBoardOrTaskModalVariantValue = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.variant;

export const getDeleteBoardOrTaskModalTitle = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.title;

  // Selector function to retrieve title state value
export const getDeleteTaskStatus = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.status;

// Selector function to retrieve title state value
export const getDeleteTaskIndex = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.index;

export const getTaskDetailsModalValue = (state: RootState) =>
  state.modals.isTaskDetailsModalOpen.isOpen;

export const getTaskDetailsModalTitle = (state: RootState) =>
  state.modals.isTaskDetailsModalOpen.title;

export const getTaskDetailsModalDescription = (state: RootState) =>
  state.modals.isTaskDetailsModalOpen.description;

export const getTaskDetailsModalSubtasks = (state: RootState) =>
  state.modals.isTaskDetailsModalOpen.subtasks;

export const getTaskDetailsModalCompletedSubtasks = (state: RootState) =>
  state.modals.isTaskDetailsModalOpen.completedSubtasks;

export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
