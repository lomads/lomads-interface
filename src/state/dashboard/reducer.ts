import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import {
	getDao,
	loadDao,
	updateDao,
	addDaoMember,
	addDaoMemberList,
	updateDaoMember,
	manageDaoMember,
	addDaoLinks,
	updateDaoLinks,
	createProject,
	addProjectMember,
	updateProjectMember,
	deleteProjectMember,
	archiveProject,
	deleteProject,
	updateProjectLink,
	getProject,
	addProjectLinks,
	updateProject,
	getCurrentUser,
	updateCurrentUser,
	createTask,
	draftTask,
	getTask,
	applyTask,
	assignTask,
	rejectTaskMember,
	submitTaskAction,
	rejectTask,
	toggleXPPoints,
	updateContract
} from "./actions";
import { createContract } from "state/contract/actions";
import { get as _get, find as _find } from "lodash";

export interface DashboardState {
	user: any;
	DAO: any;
	DAOLoading: boolean | null;
	DAOList: Array<DAOType> | null;
	updateDaoLoading: boolean | null;
	addMemberLoading: boolean | null;
	addMemberListLoading: boolean | null;
	updateMemberLoading: boolean | null;
	manageMemberLoading: boolean | null;
	addDaoLinksLoading: boolean | null;
	updateDaoLinksLoading: boolean | null;
	rejectTaskMemberLoading: boolean | null;
	Project: any;
	ProjectLoading: boolean | null;
	createProjectLoading: boolean | null;
	addProjectMemberLoading: boolean | null;
	updateProjectMemberLoading: boolean | null;
	deleteProjectMemberLoading: boolean | null;
	archiveProjectLoading: boolean | null;
	deleteProjectLoading: boolean | null;
	addProjectLinksLoading: boolean | null;
	updateProjectLoading: boolean | null;
	createTaskLoading: boolean | null;
	Task: any;
	TaskLoading: boolean | null;
	draftTaskLoading: boolean | null;
	applyTaskLoading: boolean | null;
	assignTaskLoading: boolean | null;
	submitTaskLoading: boolean | null;
	rejectTaskLoading: boolean | null;
	updateContractLoading: boolean | null;
}

const initialState: DashboardState = {
	user: null,
	DAO: null,
	DAOLoading: false,
	DAOList: null,
	updateDaoLoading: null,
	addMemberLoading: null,
	addMemberListLoading: null,
	updateMemberLoading: null,
	manageMemberLoading: null,
	addDaoLinksLoading: null,
	updateDaoLinksLoading: null,
	rejectTaskMemberLoading: null,
	Project: null,
	ProjectLoading: null,
	createProjectLoading: null,
	addProjectMemberLoading: null,
	updateProjectMemberLoading: null,
	deleteProjectMemberLoading: null,
	archiveProjectLoading: null,
	deleteProjectLoading: null,
	addProjectLinksLoading: null,
	updateProjectLoading: null,
	createTaskLoading: null,
	Task: null,
	TaskLoading: null,
	draftTaskLoading: null,
	applyTaskLoading: null,
	assignTaskLoading: null,
	submitTaskLoading: null,
	rejectTaskLoading: null,
	updateContractLoading: null
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
		resetUpdateDAOLoader(state) {
			state.updateDaoLoading = null
		},
		resetAddMemberLoader(state) {
			state.addMemberLoading = null
		},
		resetAddMemberListLoader(state) {
			state.addMemberListLoading = null
		},
		resetUpdateMemberLoader(state) {
			state.updateMemberLoading = null
		},
		resetManageMemberLoader(state) {
			state.manageMemberLoading = null
		},
		resetAddDaoLinksLoader(state) {
			state.addDaoLinksLoading = null
		},
		resetUpdateDaoLinksLoader(state) {
			state.updateDaoLinksLoading = null
		},
		resetCreateProjectLoader(state) {
			state.createProjectLoading = null
		},
		resetUpdateProjectLoader(state) {
			state.updateProjectLoading = null
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
		resetCreateTaskLoader(state) {
			state.createTaskLoading = null
		},
		resetDraftTaskLoader(state) {
			state.draftTaskLoading = null
		},
		resetSubmitTaskLoading(state) {
			state.submitTaskLoading = null
		},
		resetApplyTaskLoader(state) {
			state.applyTaskLoading = null
		},
		resetAssignTaskLoader(state) {
			state.assignTaskLoading = null
		},
		resetRejectTaskMemberLoader(state) {
			state.rejectTaskMemberLoading = null
		},
		resetRejectTaskLoader(state) {
			state.rejectTaskLoading = null
		},
		setDAOList(state, action) {
			state.DAOList = action.payload
		},
		setDAO(state, action) {
			state.DAO = action.payload
		},
		setTask(state, action) {
			state.Task = action.payload
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
			state.DAO = {
				...state.DAO,
				members: state.DAO.members.map((m: any) => {
					if (m.member._id === action.payload._id)
						return { ...m, member: action.payload }
					return m
				})
			}
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
		// update dao details
		[`${updateDao.fulfilled}`]: (state, action) => {
			state.updateDaoLoading = false
			state.DAO = action.payload
		},
		[`${updateDao.pending}`]: (state) => {
			state.updateDaoLoading = true
		},
		// add dao members
		[`${addDaoMember.fulfilled}`]: (state, action) => {
			state.addMemberLoading = false
			state.DAO = action.payload
		},
		[`${addDaoMember.pending}`]: (state) => {
			state.addMemberLoading = true
		},

		// add dao members list
		[`${addDaoMemberList.fulfilled}`]: (state, action) => {
			state.addMemberListLoading = false
			state.DAO = action.payload
		},
		[`${addDaoMemberList.pending}`]: (state) => {
			state.addMemberListLoading = true
		},

		// update dao members
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
		// delete dao members
		[`${manageDaoMember.fulfilled}`]: (state, action) => {
			state.manageMemberLoading = false
			state.DAO = action.payload
		},
		[`${manageDaoMember.pending}`]: (state) => {
			state.manageMemberLoading = true
		},
		// add dao links
		[`${addDaoLinks.fulfilled}`]: (state, action) => {
			state.addDaoLinksLoading = false;
			state.DAO = action.payload;
		},
		[`${addDaoLinks.pending}`]: (state) => {
			state.addDaoLinksLoading = true;
		},

		// udpate dao links
		[`${updateDaoLinks.fulfilled}`]: (state, action) => {
			state.updateDaoLinksLoading = false;
			state.DAO = action.payload;
		},
		[`${updateDaoLinks.pending}`]: (state) => {
			state.updateDaoLinksLoading = true;
		},

		// create contract
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
		// update project details
		[`${updateProject.fulfilled}`]: (state, action) => {
			state.updateProjectLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${updateProject.pending}`]: (state) => {
			state.updateProjectLoading = true;
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
		// task creation
		[`${createTask.fulfilled}`]: (state, action) => {
			state.createTaskLoading = false;
			state.DAO = action.payload;
		},
		[`${createTask.pending}`]: (state) => {
			state.createTaskLoading = true;
		},
		// draft a task
		[`${draftTask.fulfilled}`]: (state, action) => {
			state.draftTaskLoading = false;
			state.DAO = action.payload;
		},
		[`${draftTask.pending}`]: (state) => {
			state.draftTaskLoading = true;
		},
		// get task
		[`${getTask.fulfilled}`]: (state, action) => {
			state.TaskLoading = false;
			state.Task = action.payload;
		},
		[`${getTask.pending}`]: (state) => {
			state.TaskLoading = true;
		},
		// apply task
		[`${applyTask.fulfilled}`]: (state, action) => {
			state.applyTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${applyTask.pending}`]: (state) => {
			state.applyTaskLoading = true;
		},
		// assign task
		[`${assignTask.fulfilled}`]: (state, action) => {
			state.assignTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${assignTask.pending}`]: (state) => {
			state.assignTaskLoading = true;
		},
		// reject task member
		[`${rejectTaskMember.fulfilled}`]: (state, action) => {
			state.rejectTaskMemberLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${rejectTaskMember.pending}`]: (state) => {
			state.rejectTaskMemberLoading = true;
		},

		// submit task
		[`${submitTaskAction.fulfilled}`]: (state, action) => {
			state.submitTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${submitTaskAction.pending}`]: (state) => {
			state.submitTaskLoading = true;
		},
		// reject task submission
		[`${rejectTask.fulfilled}`]: (state, action) => {
			state.rejectTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${rejectTask.pending}`]: (state) => {
			state.rejectTaskLoading = true;
		},
		[`${toggleXPPoints.fulfilled}`]: (state, action) => {
			state.DAO = action.payload;
		},
		[`${updateContract.fulfilled}`]: (state, action) => {
			state.updateContractLoading = false
			state.DAO = action.payload;
		},
		[`${updateContract.pending}`]: (state, action) => {
			state.updateContractLoading = true
		}
	},
});

export const {
	setDAOList,
	setDAO,
	setTask,
	setUser,
	resetCreateDAOLoader,
	resetUpdateDAOLoader,
	resetAddMemberLoader,
	resetAddMemberListLoader,
	resetUpdateMemberLoader,
	resetManageMemberLoader,
	resetAddDaoLinksLoader,
	resetUpdateDaoLinksLoader,
	resetCreateProjectLoader,
	resetAddProjectMemberLoader,
	resetUpdateProjectMemberLoader,
	resetUpdateProjectLoader,
	resetDeleteProjectMemberLoader,
	resetArchiveProjectLoader,
	resetDeleteProjectLoader,
	resetAddProjectLinksLoader,
	updateSafeTransaction,
	resetCreateTaskLoader,
	resetDraftTaskLoader,
	resetApplyTaskLoader,
	resetAssignTaskLoader,
	resetRejectTaskMemberLoader,
	resetSubmitTaskLoading,
	resetRejectTaskLoader,
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
