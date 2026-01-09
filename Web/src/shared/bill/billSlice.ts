import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { BillApiHistory } from "../../project";

export interface BillState {
  billsHistory: BillApiHistory[];
}

const initialState: BillState = {
  billsHistory: [],
};

export const billSlice = createSlice({
  name: "bill",
  initialState,
  reducers: {
    setBillsHistory: (state, action: PayloadAction<BillApiHistory[]>) => {
      state.billsHistory = action.payload;
    },
  },
});

export const { setBillsHistory } = billSlice.actions;
