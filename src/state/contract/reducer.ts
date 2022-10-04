import { createSlice } from "@reduxjs/toolkit";
import { createContract } from "./actions";
import { get as _get } from "lodash";

export interface ContractState {
  createContractLoading: boolean | null;
}

const initialState: ContractState = {
  createContractLoading: null,
};

const contractSlice = createSlice({
  name: "contract",
  initialState,
  reducers: {
    resetCreateContractLoader(state) {
      state.createContractLoading = null
    },
  },
  extraReducers: {
    [`${createContract.fulfilled}`]: (state, action) => {
      state.createContractLoading = false;
    },
    [`${createContract.pending}`]: (state) => {
      state.createContractLoading = true;
    }
  },
});

export const {
    resetCreateContractLoader
} = contractSlice.actions;
export default contractSlice.reducer;
