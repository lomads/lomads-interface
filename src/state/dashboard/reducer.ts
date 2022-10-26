import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import {
	getDao,
	loadDao,
	addDaoMember,
	updateDaoMember,
	createProject,
	addProjectMember,
	updateProjectMember,
	deleteProjectMember,
	archiveProject,
	deleteProject,
	updateProjectLink,
	getProject,
	addProjectLinks,
	getCurrentUser,
	updateCurrentUser
} from "./actions";
import { createContract } from "state/contract/actions";
import { get as _get, find as _find } from "lodash";

export interface DashboardState {
	user: any;
	DAO: any;
	DAOLoading: boolean | null;
	DAOList: Array<DAOType> | null;
	addMemberLoading: boolean | null;
	updateMemberLoading: boolean | null;
	Project: any;
	ProjectLoading: boolean | null;
	createProjectLoading: boolean | null;
	addProjectMemberLoading: boolean | null;
	updateProjectMemberLoading: boolean | null;
	deleteProjectMemberLoading: boolean | null;
	archiveProjectLoading: boolean | null;
	deleteProjectLoading: boolean | null;
	addProjectLinksLoading: boolean | null;
}

const initialState: DashboardState = {
	user: null,
	DAO: null,
	DAOLoading: false,
	DAOList: null,
	addMemberLoading: null,
	updateMemberLoading: null,
	Project: null,
	ProjectLoading: null,
	createProjectLoading: null,
	addProjectMemberLoading: null,
	updateProjectMemberLoading: null,
	deleteProjectMemberLoading: null,
	archiveProjectLoading: null,
	deleteProjectLoading: null,
	addProjectLinksLoading: null,
};

const dashboardSlice = createSlice({
	name: "dashboard",
	initialState,
	reducers: {
		setUser(state, action) {
			state.user = action.payload
		},
		resetCreateDAOLoader(state) {
			state.DAOLoading = null
		},
		resetAddMemberLoader(state) {
			state.addMemberLoading = null
		},
		resetUpdateMemberLoader(state) {
			state.updateMemberLoading = null
		},
		resetCreateProjectLoader(state) {
			state.createProjectLoading = null
		},
		resetAddProjectMemberLoader(state) {
			state.addProjectMemberLoading = null
		},
		resetUpdateProjectMemberLoader(state) {
			state.updateProjectMemberLoading = null
		},
		resetDeleteProjectMemberLoader(state) {
			state.deleteProjectMemberLoading = null
		},
		resetArchiveProjectLoader(state) {
			state.archiveProjectLoading = null
		},
		resetDeleteProjectLoader(state) {
			state.deleteProjectLoading = null
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
			const tx = _find(state.DAO.safe.transactions, t => t.safeTxHash === action.payload.safeTxHash);
			if (tx) {
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
			}
			else {
				state.DAO = {
					...state.DAO,
					safe: {
						...state.DAO.safe,
						transactions: [...state.DAO.safe.transactions, action.payload]
					}
				}
			}
		},
	},
	extraReducers: {
		[`${updateCurrentUser.fulfilled}`]: (state, action) => {
			state.user = action.payload;
			state.DAO = state.DAO.members.map((m:any) => {
				if(m.member._id === action.payload._id)
					return { ...m, member: action.payload }
				return m
			})
		},
		[`${getCurrentUser.fulfilled}`]: (state, action) => {
			state.user = action.payload;
		},
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
			state.createProjectLoading = false;
			state.DAO = action.payload;
		},
		[`${createProject.pending}`]: (state, action) => {
			state.createProjectLoading = true;
		},
		[`${getProject.fulfilled}`]: (state, action) => {
			state.ProjectLoading = false;
			state.Project = action.payload;
		},
		[`${getProject.pending}`]: (state) => {
			state.ProjectLoading = true;
		},
		// add project members
		[`${addProjectMember.fulfilled}`]: (state, action) => {
			state.addProjectMemberLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${addProjectMember.pending}`]: (state) => {
			state.addProjectMemberLoading = true;
		},
		// update project members
		[`${updateProjectMember.fulfilled}`]: (state, action) => {
			state.updateProjectMemberLoading = false;
			state.Project = action.payload;
		},
		[`${updateProjectMember.pending}`]: (state) => {
			state.updateProjectMemberLoading = true;
		},
		// delete Project members
		[`${deleteProjectMember.fulfilled}`]: (state, action) => {
			state.deleteProjectMemberLoading = false;
			state.Project = action.payload;
		},
		[`${deleteProjectMember.pending}`]: (state) => {
			state.deleteProjectMemberLoading = true;
		},
		// archive Project
		[`${archiveProject.fulfilled}`]: (state, action) => {
			state.archiveProjectLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${archiveProject.pending}`]: (state) => {
			state.archiveProjectLoading = true;
		},
		// Delete project
		[`${deleteProject.fulfilled}`]: (state, action) => {
			state.deleteProjectLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${deleteProject.pending}`]: (state) => {
			state.deleteProjectLoading = true;
		},
		// add project links
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
	setUser,
	resetCreateDAOLoader,
	resetAddMemberLoader,
	resetCreateProjectLoader,
	resetAddProjectMemberLoader,
	resetUpdateProjectMemberLoader,
	resetDeleteProjectMemberLoader,
	resetArchiveProjectLoader,
	resetDeleteProjectLoader,
	resetAddProjectLinksLoader,
	updateSafeTransaction
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
