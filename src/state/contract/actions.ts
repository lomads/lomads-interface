import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';

export const createContract = createAsyncThunk(
	'contract/create',
	async (params: any, thunkApi) => {
		return axiosHttp.post(`contract`, params)
			.then(res => res.data)
			.catch(e => thunkApi.rejectWithValue(e))
	}
);
