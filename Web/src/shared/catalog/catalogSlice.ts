import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Item } from "../../project";

export interface CatalogState {
  gondolaItems: Item[];
  textureItems: Item[];
  comercialAreas: Item[];
}

const initialState: CatalogState = {
  gondolaItems: [],
  textureItems: [],
  comercialAreas: [],
};

export const catalogSlice = createSlice({
  name: "catalog",
  initialState,
  reducers: {
    setGondolaItems: (state, action: PayloadAction<Item[]>) => {
      state.gondolaItems = action.payload;
    },
    setTextureItems: (state, action: PayloadAction<Item[]>) => {
      state.textureItems = action.payload;
    },
    setComercialAreas: (state, action: PayloadAction<Item[]>) => {
      state.comercialAreas = action.payload;
    },
  },
});

export const { setGondolaItems, setTextureItems, setComercialAreas } =
  catalogSlice.actions;
