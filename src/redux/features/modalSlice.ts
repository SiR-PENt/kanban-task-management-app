import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

type CounterState = {
  [key: string]: any;
};

const initialState: CounterState = {
  isNavModalOpen: false,

  pageTitle: "",

  activeBoardIndex: 0,

  isAddOrEditBoardModalOpen: { isOpen: false, variant: "" },

  isDeleteBoardOrTaskModal: {
    isOpen: false,
    variant: "",
  },

  isTaskDetailsModal: {
    isOpen: false,
    title: "",
    subtasks: [],
    completedSubtasks: "",
    description: "",
    index: -1,
    status: "",
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

    setActiveBoardIndex: (state, { payload }) => {
       state.activeBoardIndex = payload;
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
      state.isTaskDetailsModal.status = payload.status;
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
  setActiveBoardIndex,
} = modals.actions;

export const getNavModalValue = (state: RootState) =>
  state.modals.isNavModalOpen;

export const getActiveBoardIndex = ( state: RootState) => {
  state.modals.activeBoardIndex;
}

export const getAddOrEditBoardModalValue = (state: RootState) =>
  state.modals.isAddOrEditBoardModalOpen.isOpen;

export const getAddOrEditBoardModalVariantValue = (state: RootState) =>
  state.modals.isAddOrEditBoardModalOpen.variant;

// Delete functionality
export const getDeleteBoardOrTaskModalValue = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.isOpen;

export const getDeleteBoardOrTaskModalVariantValue = (state: RootState) =>
  state.modals.isDeleteBoardOrTaskModal.variant;

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

export const getTaskDetailsModalStatus = (state: RootState) =>
  state.modals.isTaskDetailsModal.status;

export const getPageTitle = (state: RootState) => state.modals.pageTitle;

export default modals.reducer;
