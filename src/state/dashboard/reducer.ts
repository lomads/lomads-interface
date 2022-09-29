import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import { getDao } from "./actions";

export interface DashboardState {
  DAO: DAOType | null;
  DAOLoading: boolean | null;
}

const initialState: DashboardState = {
  DAO: null,
  DAOLoading: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetCreateDAOLoader(state) {
      state.DAOLoading = null
    },
  },
  extraReducers: {
    [`${getDao.fulfilled}`]: (state, action) => {
      state.DAOLoading = false;
      state.DAO = action.payload
    },
    [`${getDao.pending}`]: (state) => {
      state.DAOLoading = true;
    }
	},
});

export const {
  resetCreateDAOLoader
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
