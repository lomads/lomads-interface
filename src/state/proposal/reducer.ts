import { createSlice } from '@reduxjs/toolkit'
import { isObjectBindingPattern } from 'typescript'

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
  readonly Web3AuthAddress: string,
  readonly Web3AuthAddressPvtKey: string
  readonly coverImgPath: string
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
  Web3AuthAddress: "",
  Web3AuthAddressPvtKey: "",
  coverImgPath: "",
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
    updateWeb3AuthAddress(state,action) {
      state.Web3AuthAddress = action.payload
    },
    updateWeb3AuthAddressPvtKey(state,action) {
      state.Web3AuthAddressPvtKey = action.payload
    },
    updateCoverImgPath(state, action) {
      state.coverImgPath = action.payload
    }
  },
})

export const { updateTitle, updatePurpose,updatetokenSymbol,updatetokenTitle, updateSupply, updatedeployedTokenAddress, updateShortDesc, updateLongDesc, updateExplain, updateHolder, updatedeployedGovernorAddress,updateWeb3AuthAddress,updateWeb3AuthAddressPvtKey, updateCoverImgPath } = proposalSlice.actions
export default proposalSlice.reducer