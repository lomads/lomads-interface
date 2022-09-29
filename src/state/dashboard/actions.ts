import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosHttp from '../../api';

export const createDAO = createAsyncThunk(
	'dao/create',
	async (params: any, thunkApi) => {
		try {
            return axiosHttp.post('dao/create', params)
		} catch (e) {
			return thunkApi.rejectWithValue(e);
		}
	}
);