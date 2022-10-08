import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';
import { toast } from "react-toastify";

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
		return axiosHttp.get(`dao`)
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

export const updateDaoMember = createAsyncThunk(
	'dao/updatemember',
	async (params: any, thunkApi) => {
		return axiosHttp.patch(`member`, params.payload)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);