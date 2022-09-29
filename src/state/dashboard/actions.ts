import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';

export const getDao = createAsyncThunk(
	'dao/get',
	async (params: any, thunkApi) => {
		return axiosHttp.get(`dao/${params}`)
		.then(res => res.data)
		.catch(e => thunkApi.rejectWithValue(e))
	}
);