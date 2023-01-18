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
	editProjectMembers,
	archiveProject,
	deleteProject,
	updateProjectLink,
	editProjectLinks,
	getProject,
	addProjectLinks,
	updateProject,
	getCurrentUser,
	updateCurrentUser,
	createTask,
	editTask,
	editDraftTask,
	convertDraftTask,
	draftTask,
	getTask,
	applyTask,
	assignTask,
	rejectTaskMember,
	submitTaskAction,
	rejectTask,
	archiveTask,
	deleteTask,
	toggleXPPoints,
	updateContract,
	loadRecurringPayments,
	updateKRA,
	editProjectKRA,
	updateMilestone,
	editProjectMilestone,
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
	editProjectMemberLoading: boolean | null;
	archiveProjectLoading: boolean | null;
	deleteProjectLoading: boolean | null;
	addProjectLinksLoading: boolean | null;
	editProjectLinksLoading: boolean | null;
	updateProjectLoading: boolean | null;
	createTaskLoading: boolean | null;
	editTaskLoading: boolean | null;
	editDraftTaskLoading: boolean | null;
	convertDraftTaskLoading: boolean | null;
	Task: any;
	TaskLoading: boolean | null;
	draftTaskLoading: boolean | null;
	applyTaskLoading: boolean | null;
	assignTaskLoading: boolean | null;
	submitTaskLoading: boolean | null;
	rejectTaskLoading: boolean | null;
	archiveTaskLoading: boolean | null;
	deleteTaskLoading: boolean | null;
	updateContractLoading: boolean | null;
	recurringPayments: any;
	recurringPaymentsLoading: boolean | null;
	updateKraLoading: boolean | null;
	editProjectKraLoading: boolean | null;
	updateMilestoneLoading: boolean | null;
	editProjectMilestoneLoading: boolean | null;
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
	editProjectMemberLoading: null,
	archiveProjectLoading: null,
	deleteProjectLoading: null,
	addProjectLinksLoading: null,
	editProjectLinksLoading: null,
	updateProjectLoading: null,
	createTaskLoading: null,
	editTaskLoading: null,
	editDraftTaskLoading: null,
	convertDraftTaskLoading: null,
	Task: null,
	TaskLoading: null,
	draftTaskLoading: null,
	applyTaskLoading: null,
	assignTaskLoading: null,
	submitTaskLoading: null,
	rejectTaskLoading: null,
	archiveTaskLoading: null,
	deleteTaskLoading: null,
	updateContractLoading: null,
	recurringPayments: null,
	recurringPaymentsLoading: null,
	updateKraLoading: null,
	editProjectKraLoading: null,
	updateMilestoneLoading: null,
	editProjectMilestoneLoading: null,
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
		resetEditProjectMemberLoader(state) {
			state.editProjectMemberLoading = null
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
		resetEditProjectLinksLoader(state) {
			state.editProjectLinksLoading = null
		},
		resetCreateTaskLoader(state) {
			state.createTaskLoading = null
		},
		resetEditTaskLoader(state) {
			state.editTaskLoading = null
		},
		resetEditDraftTaskLoader(state) {
			state.editDraftTaskLoading = null
		},
		resetConvertDraftTaskLoader(state) {
			state.convertDraftTaskLoading = null
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
		resetArchiveTaskLoader(state) {
			state.archiveTaskLoading = null
		},
		resetDeleteTaskLoader(state) {
			state.deleteTaskLoading = null
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
		resetUpdateContractLoading(state, action) {
			state.updateContractLoading = null
		},
		resetUpdateKraLoader(state) {
			state.updateKraLoading = null
		},
		resetEditProjectKraLoader(state) {
			state.editProjectKraLoading = null
		},
		resetUpdateMilestoneLoader(state) {
			state.updateMilestoneLoading = null
		},
		resetEditProjectMilestoneLoader(state) {
			state.editProjectMilestoneLoading = null
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
		setRecurringPayments(state, action) {
			state.recurringPayments = action.payload
		}
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
		// edit Project members
		[`${editProjectMembers.fulfilled}`]: (state, action) => {
			state.editProjectMemberLoading = false;
			state.Project = action.payload;
		},
		[`${editProjectMembers.pending}`]: (state) => {
			state.editProjectMemberLoading = true;
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
		// edit project links
		[`${editProjectLinks.fulfilled}`]: (state, action) => {
			state.editProjectLinksLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${editProjectLinks.pending}`]: (state) => {
			state.editProjectLinksLoading = true;
		},
		// update project single link --- unlock link
		[`${updateProjectLink.fulfilled}`]: (state, action) => {
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${updateProjectLink.pending}`]: (state) => {

		},
		// task creation
		[`${createTask.fulfilled}`]: (state, action) => {
			state.createTaskLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${createTask.pending}`]: (state) => {
			state.createTaskLoading = true;
		},
		// edit task
		[`${editTask.fulfilled}`]: (state, action) => {
			state.editTaskLoading = false;
			state.Task = action.payload.task;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${editTask.pending}`]: (state) => {
			state.editTaskLoading = true;
		},
		// edit draft task
		[`${editDraftTask.fulfilled}`]: (state, action) => {
			state.editDraftTaskLoading = false;
			state.Task = action.payload.task;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${editDraftTask.pending}`]: (state) => {
			state.editDraftTaskLoading = true;
		},
		// convert draft task
		[`${convertDraftTask.fulfilled}`]: (state, action) => {
			state.convertDraftTaskLoading = false;
			state.Task = action.payload.task;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${convertDraftTask.pending}`]: (state) => {
			state.convertDraftTaskLoading = true;
		},
		// draft a task
		[`${draftTask.fulfilled}`]: (state, action) => {
			state.draftTaskLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
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
		// archive task
		[`${archiveTask.fulfilled}`]: (state, action) => {
			state.archiveTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
			state.Project = action.payload.project;
		},
		[`${archiveTask.pending}`]: (state) => {
			state.archiveTaskLoading = true;
		},
		// Delete task
		[`${deleteTask.fulfilled}`]: (state, action) => {
			state.deleteTaskLoading = false;
			state.Task = action.payload.task;
			state.DAO = action.payload.dao;
		},
		[`${deleteTask.pending}`]: (state) => {
			state.deleteTaskLoading = true;
		},
		[`${toggleXPPoints.fulfilled}`]: (state, action) => {
			state.DAO = action.payload;
		},
		// Update contract
		[`${updateContract.fulfilled}`]: (state, action) => {
			state.updateContractLoading = false
			state.DAO = action.payload;
		},
		[`${updateContract.pending}`]: (state, action) => {
			state.updateContractLoading = true
		},
		[`${loadRecurringPayments.fulfilled}`]: (state, action) => {
			state.recurringPaymentsLoading = false
			state.recurringPayments = action.payload;
		},
		[`${loadRecurringPayments.pending}`]: (state, action) => {
			state.recurringPaymentsLoading = true
		},
		// update kra
		[`${updateKRA.fulfilled}`]: (state, action) => {
			state.updateKraLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${updateKRA.pending}`]: (state) => {
			state.updateKraLoading = true;
		},
		// edit kra
		[`${editProjectKRA.fulfilled}`]: (state, action) => {
			state.editProjectKraLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${editProjectKRA.pending}`]: (state) => {
			state.editProjectKraLoading = true;
		},
		// update milestone
		[`${updateMilestone.fulfilled}`]: (state, action) => {
			state.updateMilestoneLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${updateMilestone.pending}`]: (state) => {
			state.updateMilestoneLoading = true;
		},
		// edit milestone
		[`${editProjectMilestone.fulfilled}`]: (state, action) => {
			state.editProjectMilestoneLoading = false;
			state.Project = action.payload.project;
			state.DAO = action.payload.dao;
		},
		[`${editProjectMilestone.pending}`]: (state) => {
			state.editProjectMilestoneLoading = true;
		},
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
	resetEditProjectMemberLoader,
	resetArchiveProjectLoader,
	resetDeleteProjectLoader,
	resetAddProjectLinksLoader,
	resetEditProjectLinksLoader,
	updateSafeTransaction,
	resetCreateTaskLoader,
	resetEditTaskLoader,
	resetEditDraftTaskLoader,
	resetConvertDraftTaskLoader,
	resetDraftTaskLoader,
	resetApplyTaskLoader,
	resetAssignTaskLoader,
	resetRejectTaskMemberLoader,
	resetSubmitTaskLoading,
	resetRejectTaskLoader,
	resetArchiveTaskLoader,
	resetDeleteTaskLoader,
	resetUpdateContractLoading,
	setRecurringPayments,
	resetUpdateKraLoader,
	resetEditProjectKraLoader,
	resetUpdateMilestoneLoader,
	resetEditProjectMilestoneLoader
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
