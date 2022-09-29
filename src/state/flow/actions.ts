import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';

export const createDAO = createAsyncThunk(
	'dao/create',
	async (params: any, thunkApi) => {
		return axiosHttp.post('dao/create', params)
		.then(res => res.data)
		.catch(e => thunkApi.rejectWithValue(e))
	}
);