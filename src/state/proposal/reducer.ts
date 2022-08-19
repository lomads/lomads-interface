import { createSlice } from '@reduxjs/toolkit'
import { saturate } from 'polished'
import { isObjectBindingPattern } from 'typescript'

export interface ProposalState {
  readonly title: string
  readonly purpose: string
  readonly template: string
  readonly tokenTitle: string
  readonly tokenSymbol: string
  readonly supply: number
  readonly shortDesc: string
  readonly deployedTokenAddress: string | null,
  readonly longDesc: string
  readonly explain: string
  readonly holder: string
  readonly deployedGovernorAddress: string,
  readonly Web3AuthAddress: string,
  readonly Web3AuthAddressPvtKey: string
  readonly coverImgPath: string
  readonly iconImgPath: string
  readonly tags: Array<string>|([])
  readonly communityTags: Array<string>|([])
  readonly support: number
  readonly minApproval: number
  readonly voteDurDay: number
  readonly voteDurHour: number
}

const initialState: ProposalState = {
  title: "",
  purpose: "",
  template: "",
  tokenTitle: "",
  tokenSymbol: "",
  supply: 0,
  shortDesc: "",
  deployedTokenAddress: null,
  longDesc: "",
  explain: "",
  holder: "",
  deployedGovernorAddress: "",
  Web3AuthAddress: "",
  Web3AuthAddressPvtKey: "",
  coverImgPath: "",
  iconImgPath: "",
  tags:[],
  communityTags:[],
  support: 0,
  minApproval: 0,
  voteDurDay: 0,
  voteDurHour: 0,
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
    updateTemplate(state, action) {
      state.template = action.payload
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
    },
    updateIconImgPath(state, action) {
      state.iconImgPath = action.payload
    },
    updateTags(state, action) {
      state.tags = action.payload
    },
    updateCommunityTags(state, action) {
      state.communityTags = action.payload
    },
    updateSupport(state, action) {
      state.support = action.payload
    },
    updateMinApproval(state, action) {
      state.minApproval = action.payload
    },
    updateVoteDurDay(state, action) {
      state.voteDurDay = action.payload
    },
    updateVoteDurHour(state, action) {
      state.voteDurHour = action.payload
    }
  },
})

export const { updateTitle, updatePurpose,updatetokenSymbol,updatetokenTitle, updateSupply, updatedeployedTokenAddress, updateShortDesc, updateLongDesc, updateExplain, updateHolder, updatedeployedGovernorAddress,updateWeb3AuthAddress,updateWeb3AuthAddressPvtKey, updateCoverImgPath, updateIconImgPath, updateTags, updateCommunityTags, updateTemplate, updateMinApproval, updateSupport, updateVoteDurDay, updateVoteDurHour } = proposalSlice.actions
export default proposalSlice.reducer