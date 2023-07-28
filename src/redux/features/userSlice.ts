import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../store";

interface InitialState {
  userDetails: {[key: string]: any}
}
const initialState: InitialState = {
    userDetails: {}
  }

export const user = createSlice({
    name: "user",
    initialState,
    reducers: {
      updateUserDetails: (state, { payload }) => {
          state.userDetails = payload
      },
    },
  });

export const {
    updateUserDetails,
  } = user.actions;
  
export const getUserDetails = (state: RootState) => state.user.userDetails;
  
export default user.reducer;