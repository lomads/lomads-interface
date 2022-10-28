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

export const addDaoMember = createAsyncThunk(
	'dao/addmember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`dao/${params.url}/add-member`, params.payload)
			.then(res => res.data)
			.catch(e => {
				toast.error(e.response.data.message);
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