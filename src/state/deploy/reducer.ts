import { createSlice } from '@reduxjs/toolkit'

export interface ProposalState {
  readonly governorAddress: string
  readonly tokenAddress: string
}

const initialState: ProposalState = {
  governorAddress: "",
  tokenAddress: "",
}

const proposalSlice = createSlice({
  name: 'deploy',
  initialState,
  reducers: {
    updateGovernorAddress(state, action) {
      state.governorAddress = action.payload
    },
    updateTokenAddress(state, action) {
      state.tokenAddress = action.payload
    },
  },
})

export const { updateGovernorAddress, updateTokenAddress } = proposalSlice.actions
export default proposalSlice.reducer