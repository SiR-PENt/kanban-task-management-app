import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
  [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,

  pageTitle: "",

  isAddOrEditBoardModalOpen: { isOpen: false, variant: "" },

  isDeleteBoardOrTaskModal: {
    isOpen: false,
    variant: "",
    title: "",
    status: "",
    index: -1,
  },

  isTaskDetailsModal: {
    isOpen: false,
    title: "",
    subtasks: [],
    completedSubtasks: "",
    description: "",
    index: -1,
  },

  isAddOrEditTaskModal: {
    isOpen: false,
    variant: "",
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

    // Open the Add and Edit task modal with a specified variant (add or edit)
    openAddOrEditTaskModal: (state, { payload }) => {
      state.isAddOrEditTaskModal.isOpen = true;
      state.isAddOrEditTaskModal.variant = payload.variant;
    },

    // Close the Add and Edit task modal
    closeAddOrEditTaskModal: (state) => {
      state.isAddOrEditTaskModal.isOpen = false;
      state.isAddOrEditTaskModal.variant = "";
    },

    openTaskDetailsModal: (state, { payload }) => {
      state.isTaskDetailsModal.isOpen = true;
      state.isTaskDetailsModal.title = payload.title;
      state.isTaskDetailsModal.description = payload.description;
      state.isTaskDetailsModal.subtasks = payload.subtasks;
      state.isTaskDetailsModal.completedSubtasks = payload.completedSubtasks;
      state.isTaskDetailsModal.index = payload.index;
    },

    closeTaskDetailsModal: (state) => {
      state.isTaskDetailsModal.isOpen = false;
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

// add and edit task
export const getAddOrEditTaskModalValue = (state: RootState) =>
state.modals.isAddOrEditTaskModal.isOpen;
// Selector function to retrieve variant state value 
export const getAddOrEditTaskModalVariantValue = (state: RootState) =>
state.modals.isAddOrEditTaskModal.variant;

export const getTaskDetailsModalValue = (state: RootState) =>
  state.modals.isTaskDetailsModal.isOpen;

export const getTaskDetailsModalTitle = (state: RootState) =>
  state.modals.isTaskDetailsModal.title;

export const getTaskDetailsModalDescription = (state: RootState) =>
  state.modals.isTaskDetailsModal.description;

export const getTaskDetailsModalSubtasks = (state: RootState) =>
  state.modals.isTaskDetailsModal.subtasks;

export const getTaskDetailsModalCompletedSubtasks = (state: RootState) =>
  state.modals.isTaskDetailsModal.completedSubtasks;

export const getTaskDetailsModalIndex = (state: RootState) =>
  state.modals.isTaskDetailsModal.index;

export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
