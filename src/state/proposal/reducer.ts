import { createSlice } from '@reduxjs/toolkit'

export interface ProposalState {
  readonly title: string
  readonly purpose: string
  readonly tokenTitle: string
  readonly tokenSymbol: string
  readonly supply: number
  readonly shortDesc: string
  readonly deployedTokenAddress: string,
  readonly longDesc: string
  readonly explain: string
  readonly holder: string
  readonly deployedGovernorAddress: string,
}

const initialState: ProposalState = {
  title: "",
  purpose: "",
  tokenTitle: "",
  tokenSymbol: "",
  supply: 0,
  shortDesc: "",
  deployedTokenAddress: "",
  longDesc: "",
  explain: "",
  holder: "",
  deployedGovernorAddress: "",
}

const proposalSlice = createSlice({
  name: 'proposal',
  initialState,
  reducers: {
    updateTitle(state, action) {
      state.title = action.payload
    },
    updatePurpose(state, action) {
      state.purpose = action.payload
    },
    updatetokenTitle(state, action) {
      state.tokenTitle = action.payload
    },
    updatetokenSymbol(state, action) {
      state.tokenSymbol = action.payload
    },
    updateSupply(state, action) {
      state.supply = action.payload
    },
    updatedeployedTokenAddress(state, action) {
      state.deployedTokenAddress = action.payload
    },
    updateShortDesc(state, action) {
      state.shortDesc = action.payload
    },
    updateLongDesc(state, action) {
      state.longDesc = action.payload
    },
    updateExplain(state, action) {
      state.explain = action.payload
    },
    updateHolder(state, action) {
      state.holder = action.payload
    },
    updatedeployedGovernorAddress(state, action) {
      state.deployedGovernorAddress = action.payload
    },
  },
})

export const { updateTitle, updatePurpose,updatetokenSymbol,updatetokenTitle, updateSupply, updatedeployedTokenAddress, updateShortDesc, updateLongDesc, updateExplain, updateHolder, updatedeployedGovernorAddress } = proposalSlice.actions
export default proposalSlice.reducer