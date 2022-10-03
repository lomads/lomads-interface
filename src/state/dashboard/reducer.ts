import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import { getDao, loadDao, addDaoMember } from "./actions";

export interface DashboardState {
  DAO: DAOType | null;
  DAOLoading: boolean | null;
  DAOList: Array<DAOType>;
  addMemberLoading: boolean | null;
}

const initialState: DashboardState = {
  DAO: null,
  DAOLoading: false,
  DAOList: [],
  addMemberLoading: null
};

const dashboardSlice = createSlice({
  name: "dashboard",
  initialState,
  reducers: {
    resetCreateDAOLoader(state) {
      state.DAOLoading = null
    },
    resetAddMemberLoader(state) {
      state.addMemberLoading = null
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

    },
    [`${addDaoMember.fulfilled}`]: (state, action) => {
      state.addMemberLoading = false
      state.DAO = action.payload
    },
    [`${addDaoMember.pending}`]: (state) => {
      state.addMemberLoading = true
    }
	},
});

export const {
  setDAOList,
  resetCreateDAOLoader,
  resetAddMemberLoader
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
