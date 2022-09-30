import { createSlice } from "@reduxjs/toolkit";
import { InviteGangType, OwnerType } from "types/UItype";

export interface FlowState {
  readonly daoName: string;
  readonly daoAddress: string;
  readonly invitedGang: Array<InviteGangType>;
  readonly safeName: string;
  readonly safeAddress: string;
  readonly owners: Array<OwnerType>;
  readonly threshold: number;
  readonly totalMembers: Array<InviteGangType>;
  readonly currentNonce: number;
  readonly safeThreshold: number;
}

const initialState: FlowState = {
  daoName: "",
  daoAddress: "",
  invitedGang: [],
  owners: [],
  safeName: "",
  safeAddress: "",
  threshold: 0,
  totalMembers: [],
  currentNonce: 0,
  safeThreshold: 0,
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    updateDaoName(state, action) {
      state.daoName = action.payload;
    },
    updateDaoAddress(state, action) {
      state.daoAddress = action.payload;
    },
    updateInvitedGang(state, action) {
      state.invitedGang = action.payload;
    },
    updateOwners(state, action) {
      state.owners = action.payload;
    },
    updatesafeName(state, action) {
      state.safeName = action.payload;
    },
    updateSafeAddress(state, action) {
      state.safeAddress = action.payload;
    },
    updateThreshold(state, action) {
      state.threshold = action.payload;
    },
    updateTotalMembers(state, action) {
      state.totalMembers = action.payload;
    },
    updateCurrentNonce(state, action) {
      state.currentNonce = action.payload;
    },
    updateSafeThreshold(state, action) {
      state.safeThreshold = action.payload;
    },
  },
});
export const {
  updateDaoName,
  updateDaoAddress,
  updateInvitedGang,
  updateOwners,
  updatesafeName,
  updateSafeAddress,
  updateThreshold,
  updateTotalMembers,
  updateCurrentNonce,
  updateSafeThreshold,
} = flowSlice.actions;
export default flowSlice.reducer;
