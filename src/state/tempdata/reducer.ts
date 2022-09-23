import { createSlice } from "@reduxjs/toolkit";
import { IsetRecipientType } from "types/DashBoardType";
import { InviteGangType, OwnerType } from "types/UItype";

export interface FlowState {
  readonly selectedRecipients: InviteGangType[];
  readonly setRecipient: IsetRecipientType[];
}

const initialState: FlowState = {
  selectedRecipients: [],
  setRecipient: [],
};

const flowSlice = createSlice({
  name: "flow",
  initialState,
  reducers: {
    updateSelectedRecipients(state, action) {
      state.selectedRecipients = action.payload;
    },
    updateSetRecipient(state, action) {
      state.setRecipient = action.payload;
    },
  },
});
export const { updateSelectedRecipients, updateSetRecipient } =
  flowSlice.actions;
export default flowSlice.reducer;
