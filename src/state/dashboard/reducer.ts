import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import { getDao, loadDao } from "./actions";

export interface DashboardState {
  DAO: DAOType | null;
  DAOLoading: boolean | null;
  DAOList: Array<DAOType>;
}

const initialState: DashboardState = {
  DAO: null,
  DAOLoading: false,
  DAOList: [],
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetCreateDAOLoader(state) {
      state.DAOLoading = null
    },
    setDAOList(state, action) {
      state.DAOList = action.payload
    }
  },
  extraReducers: {
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

    }
	},
});

export const {
  setDAOList,
  resetCreateDAOLoader
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
