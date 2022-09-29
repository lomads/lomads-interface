import { createSlice } from "@reduxjs/toolkit";
import { InviteGangType, OwnerType } from "types/UItype";
import { createDAO } from "./actions";

export interface FlowState {
  readonly daoName: string;
  readonly daoAddress: string;
  readonly invitedGang: Array<InviteGangType>;
  readonly safeName: string;
  readonly safeAddress: string;
  readonly owners: Array<OwnerType>;
  readonly threshold: number;
  readonly totalMembers: Array<InviteGangType>;
  readonly createDAOLoading: boolean | null;
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
  createDAOLoading: null
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
    resetCreateDAOLoader(state) {
      state.createDAOLoading = null
    },
  },
  extraReducers: {
    [`${createDAO.fulfilled}`]: (state) => {
       state.createDAOLoading = false
    },
    [`${createDAO.pending}`]: (state) => {
      state.createDAOLoading = true
   }
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
  resetCreateDAOLoader
} = flowSlice.actions;
export default flowSlice.reducer;
