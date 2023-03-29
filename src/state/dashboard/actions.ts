import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';
import { toast } from "react-toastify";

export const getCurrentUser = createAsyncThunk(
	'auth/me',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`auth/me`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const updateCurrentUser = createAsyncThunk(
	'auth/me/update',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`auth/me`, params)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const getDao = createAsyncThunk(
	'dao/get',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`dao/${params}`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const loadDao = createAsyncThunk(
	'dao/load',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`dao?chainId=${params.chainId}`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const updateDao = createAsyncThunk(
	'dao/updateDao',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/update-details`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const updateUserOnboardingCount = createAsyncThunk(
	'user/updateOnboardingCount',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`member/update-onboarding-count`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const addDaoMember = createAsyncThunk(
	'dao/addmember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/add-member`, params.payload)
			.then(res => res.data)
			.catch(e => {
				//toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const addDaoMemberList = createAsyncThunk(
	'dao/addmemberList',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/add-member-list`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const manageDaoMember = createAsyncThunk(
	'dao/managemember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/manage-member`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateDaoMember = createAsyncThunk(
	'dao/updatemember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`member`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const addDaoLinks = createAsyncThunk(
	'dao/addDaoLinks',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/add-links`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateDaoLinks = createAsyncThunk(
	'dao/updateDaoLinks',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/update-links`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const deleteDaoLink = createAsyncThunk(
	'dao/deleteDaoLink',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/delete-link`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
)

export const createProject = createAsyncThunk(
	'dao/createProject',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`project`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const getProject = createAsyncThunk(
	'dao/getProject',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`project/${params}`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const updateProject = createAsyncThunk(
	'dao/updateProject',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/update-project?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const addProjectMember = createAsyncThunk(
	'dao/addProjectMember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/add-member?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateProjectMember = createAsyncThunk(
	'dao/updateProjectMember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/update-member`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const deleteProjectMember = createAsyncThunk(
	'dao/deleteProjectMember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/delete-member`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const editProjectMembers = createAsyncThunk(
	'dao/editProjectMembers',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/edit-members`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const archiveProject = createAsyncThunk(
	'dao/archiveProject',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/archive?daoUrl=${params.daoUrl}`)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateViewProject = createAsyncThunk(
	'dao/updateViewProject',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/updateView?daoUrl=${params.daoUrl}`)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const deleteProject = createAsyncThunk(
	'dao/deleteProject',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/delete?daoUrl=${params.daoUrl}`)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const addProjectLinks = createAsyncThunk(
	'dao/addProjectLinks',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/add-links?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateProjectLink = createAsyncThunk(
	'dao/updateProjectLinks',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/update-link?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const editProjectLinks = createAsyncThunk(
	'dao/editProjectLinks',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/edit-links?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);
// TASK ACTIONS

export const getTask = createAsyncThunk(
	'dao/getTask',
	async (params: any, thunkApi) => {
		console.log("called getTask")
		return axiosHttp.get(`task/${params}`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);

export const storeGithubIssues = createAsyncThunk(
	'dao/storeGithubIssues',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`utility/store-issues`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const syncTrelloData = createAsyncThunk(
	'dao/syncTrelloData',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`utility/sync-trello-data`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const createTask = createAsyncThunk(
	'dao/createTask',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`task`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const draftTask = createAsyncThunk(
	'dao/draftTask',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`task/draft`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const applyTask = createAsyncThunk(
	'dao/applyTask',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/apply?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const assignTask = createAsyncThunk(
	'dao/assignTask',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/assign?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)


export const rejectTaskMember = createAsyncThunk(
	'dao/rejectTaskMember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/reject-member?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const submitTaskAction = createAsyncThunk(
	'dao/submittaskaction',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/submit?daoUrl=${params.daoUrl}`, params)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const approveTask = createAsyncThunk(
	'dao/approvetaskaction',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`task/${params.taskId}/approve?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const rejectTask = createAsyncThunk(
	'dao/rejectTask',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`task/${params.taskId}/reject?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const toggleXPPoints = createAsyncThunk(
	'dao/togglexppoints',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.daoUrl}/sweat-points`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const archiveTask = createAsyncThunk(
	'dao/archiveTask',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/archive?daoUrl=${params.daoUrl}`)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const deleteTask = createAsyncThunk(
	'dao/deleteTask',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/delete?daoUrl=${params.daoUrl}`)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const editTask = createAsyncThunk(
	'dao/editTask',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`task/${params.taskId}/edit?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const editDraftTask = createAsyncThunk(
	'dao/editDraftTask',
	async (params: any, thunkApi) => {
		console.log("Task ID : ", params.taskId);
		return axiosHttp.patch(`task/${params.taskId}/editDraft?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const convertDraftTask = createAsyncThunk(
	'dao/convertDraftTask',
	async (params: any, thunkApi) => {
		console.log("Task ID : ", params.taskId);
		return axiosHttp.patch(`task/${params.taskId}/convertDraft?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)


export const updateContract = createAsyncThunk(
	'contract/update',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`contract/${params.contractAddress}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const loadRecurringPayments = createAsyncThunk(
	'recurringPayment/load',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`/recurring-payment?safeAddress=${params.safeAddress}`)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const createRecurringPayment = createAsyncThunk(
	'recurringPayment/create',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`recurring-payment`, params)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const updateRecurringPayment = createAsyncThunk(
	'recurringPayment/update',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`recurring-payment/${params.recurringTxnId}`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
)

export const updateKRA = createAsyncThunk(
	'dao/updateKRA',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/update-kra?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const editProjectKRA = createAsyncThunk(
	'dao/editProjectKRA',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/edit-kra?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const updateMilestone = createAsyncThunk(
	'dao/updateMilestone',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/update-milestones?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

export const editProjectMilestone = createAsyncThunk(
	'dao/editProjectMilestone',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`project/${params.projectId}/edit-milestones?daoUrl=${params.daoUrl}`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
				return thunkApi.rejectWithValue(e)
			})
	}
);

