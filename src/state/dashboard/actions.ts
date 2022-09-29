import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';

export const getDao = createAsyncThunk(
	'dao/create',
	async (url: string, thunkApi) => {
		return axiosHttp.post(`dao/${url}`)
		.then(res => res.data)
		.catch(e => thunkApi.rejectWithValue(e))
	}
);