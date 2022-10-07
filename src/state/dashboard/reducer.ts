import { createSlice } from "@reduxjs/toolkit";
import { DAOType } from "types/UItype";
import { getDao, loadDao, addDaoMember, updateDaoMember } from "./actions";
import { createContract } from "state/contract/actions";
import { get as _get } from "lodash";

export interface DashboardState {
  // DAO: DAOType | null;
  DAO: any;
  DAOLoading: boolean | null;
  DAOList: Array<DAOType>;
  addMemberLoading: boolean | null;
  updateMemberLoading: boolean | null;
}

const initialState: DashboardState = {
  DAO: null,
  DAOLoading: false,
  DAOList: [],
  addMemberLoading: null,
  updateMemberLoading: null,
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
    resetUpdateMemberLoader(state) {
      state.updateMemberLoading = null
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
    },
    [`${updateDaoMember.fulfilled}`]: (state, action) => {
      state.updateMemberLoading = false
      state.DAO = {
        ...(state.DAO ? state.DAO : {}),
        members: _get(state, 'DAO.members', []).map((member: any) => {
          if (member.member._id === action.payload._id)
            return { ...member, member: action.payload };
          return member;
        })
      }
    },
    [`${updateDaoMember.pending}`]: (state) => {
      state.updateMemberLoading = true
    },
    [`${createContract.fulfilled}`]: (state, action) => {
      state.DAO = action.payload
    },
  },
});

export const {
  setDAOList,
  resetCreateDAOLoader,
  resetAddMemberLoader
} = dashboardSlice.actions;
export default dashboardSlice.reducer;
