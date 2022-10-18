import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import { getDao, loadDao, addDaoMember, updateDaoMember, createProject, addProjectMember, updateProjectLink, getProject, addProjectLinks } from "./actions";
import { createContract } from "state/contract/actions";
import { get as _get } from "lodash";

export interface DashboardState {
	// DAO: DAOType | null;
	DAO: any;
	DAOLoading: boolean | null;
	DAOList: Array<DAOType>;
	addMemberLoading: boolean | null;
	updateMemberLoading: boolean | null;
	Project: any;
	ProjectLoading: boolean | null;
	addProjectMemberLoading: boolean | null;
	addProjectLinksLoading: boolean | null;
}

const initialState: DashboardState = {
	DAO: null,
	DAOLoading: false,
	DAOList: [],
	addMemberLoading: null,
	updateMemberLoading: null,
	Project: null,
	ProjectLoading: null,
	addProjectMemberLoading: null,
	addProjectLinksLoading: null,
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		resetCreateDAOLoader(state) {
			state.DAOLoading = null
		},
		resetAddMemberLoader(state) {
			state.addMemberLoading = null
		},
		resetUpdateMemberLoader(state) {
			state.updateMemberLoading = null
		},
		resetAddProjectMemberLoader(state) {
			state.addProjectMemberLoading = null
		},
		resetAddProjectLinksLoader(state) {
			state.addProjectLinksLoading = null
		},
		setDAOList(state, action) {
			state.DAOList = action.payload
		},
		setDAO(state, action) {
			state.DAO = action.payload
		},
		updateSafeTransaction(state, action) {
			console.log(action.payload)
			state.DAO = {
				...state.DAO,
				safe: {
					...state.DAO.safe,
					transactions: state.DAO.safe.transactions.map((t: any) => {
						if (t.safeTxHash === action.payload.safeTxHash)
							return action.payload
						return t
					})
				}
			}
		},
	},
	extraReducers: {
		[`${getDao.fulfilled}`]: (state, action) => {
			state.DAOLoading = false;
			state.DAO = action.payload
		},
		[`${getDao.pending}`]: (state) => {
			state.DAOLoading = true;
		},
		[`${loadDao.fulfilled}`]: (state, action) => {
			state.DAOList = action.payload
		},
		[`${loadDao.pending}`]: (state) => {

		},
		[`${addDaoMember.fulfilled}`]: (state, action) => {
			state.addMemberLoading = false
			state.DAO = action.payload
		},
		[`${addDaoMember.pending}`]: (state) => {
			state.addMemberLoading = true
		},
		[`${updateDaoMember.fulfilled}`]: (state, action) => {
			state.updateMemberLoading = false
			state.DAO = {
				...(state.DAO ? state.DAO : {}),
				members: _get(state, 'DAO.members', []).map((member: any) => {
					if (member.member._id === action.payload._id)
						return { ...member, member: action.payload };
					return member;
				})
			}
		},
		[`${updateDaoMember.pending}`]: (state) => {
			state.updateMemberLoading = true
		},
		[`${createContract.fulfilled}`]: (state, action) => {
			state.DAO = action.payload
		},
		// project related
		[`${createProject.fulfilled}`]: (state, action) => {
			state.DAO = action.payload
		},
		[`${getProject.fulfilled}`]: (state, action) => {
			state.ProjectLoading = false;
			state.Project = action.payload;
		},
		[`${getProject.pending}`]: (state) => {
			state.ProjectLoading = true;
		},
		[`${addProjectMember.fulfilled}`]: (state, action) => {
			state.addProjectMemberLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${addProjectMember.pending}`]: (state) => {
			state.addProjectMemberLoading = true;
		},
		[`${addProjectLinks.fulfilled}`]: (state, action) => {
			state.addProjectLinksLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${addProjectLinks.pending}`]: (state) => {
			state.addProjectLinksLoading = true;
		},
		[`${updateProjectLink.fulfilled}`]: (state, action) => {
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${updateProjectLink.pending}`]: (state) => {
			
		},
	},
});

export const {
	setDAOList,
	setDAO,
	resetCreateDAOLoader,
	resetAddMemberLoader,
	resetAddProjectMemberLoader,
	resetAddProjectLinksLoader,
	updateSafeTransaction
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
