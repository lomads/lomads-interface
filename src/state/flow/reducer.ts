import { createSlice } from "@reduxjs/toolkit";
import { InviteGangType, OwnerType } from "types/UItype";
import { createDAO } from "./actions";

export interface FlowState {
	readonly daoName: string;
	readonly daoImage: string;
	readonly daoAddress: string;
	readonly invitedGang: Array<InviteGangType>;
	readonly safeName: string;
	readonly safeAddress: string;
	readonly owners: Array<OwnerType>;
	readonly threshold: number;
	readonly totalMembers: Array<InviteGangType>;
	readonly createDAOLoading: boolean | null;
	readonly currentNonce: number;
	readonly safeThreshold: number;
}

const initialState: FlowState = {
	daoName: "",
	daoAddress: "",
	daoImage: "",
	invitedGang: [],
	owners: [],
	safeName: "",
	safeAddress: "",
	threshold: 0,
	totalMembers: [],
	createDAOLoading: null,
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
		updateDaoImage(state, action) {
			state.daoImage = action.payload;
		},
		updateDaoAddress(state, action) {
			state.daoAddress = action.payload;
		},
		updateInvitedGang(state, action) {
			state.invitedGang = action.payload;
		},
		appendInviteMembers(state, action) {
			state.invitedGang = [...state.invitedGang, ...action.payload];
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
		updateCurrentNonce(state, action) {
			state.currentNonce = action.payload;
		},
		updateSafeThreshold(state, action) {
			state.safeThreshold = action.payload;
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
	updateDaoImage,
	updateDaoAddress,
	updateInvitedGang,
	appendInviteMembers,
	updateOwners,
	updatesafeName,
	updateSafeAddress,
	updateThreshold,
	updateTotalMembers,
	resetCreateDAOLoader,
	updateCurrentNonce,
	updateSafeThreshold,
} = flowSlice.actions;

export default flowSlice.reducer;
