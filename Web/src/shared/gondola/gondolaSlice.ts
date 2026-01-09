import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { Item, PrefabricatedGondola, Rectangle } from "../../project";

export interface ActiveGondola {
  rectangles: Rectangle[];
  comercialArea: Item;
  widthAreaMeters: number;
}

export interface GondolaState {
  activeCustomGondola: ActiveGondola;
  activePrefabricatedGondola: ActiveGondola;
  prefabricatedGondolas: PrefabricatedGondola[];
}

const initialState: GondolaState = {
  prefabricatedGondolas: [],
  activeCustomGondola: {
    rectangles: [],
    comercialArea: {
      id: 0,
      nombre: "",
      url: "",
    },
    widthAreaMeters: 0,
  },
  activePrefabricatedGondola: {
    rectangles: [],
    comercialArea: {
      id: 0,
      nombre: "",
      url: "",
    },
    widthAreaMeters: 0,
  },
};

export const gondolaSlice = createSlice({
  name: "gondola",
  initialState,
  reducers: {
    //*Custom
    setCustomComercialArea: (state, action: PayloadAction<Item>) => {
      state.activeCustomGondola.comercialArea = action.payload;
    },
    setCustomGondolaRectangles: (state, action: PayloadAction<Rectangle>) => {
      state.activeCustomGondola.rectangles.push(action.payload);
    },

    //*Prefabricated
    setPrefabricatedComercialArea: (state, action: PayloadAction<Item>) => {
      state.activePrefabricatedGondola.comercialArea = action.payload;
    },
    setPrefabricatedGondolaRectangles: (
      state,
      action: PayloadAction<Rectangle>
    ) => {
      state.activePrefabricatedGondola.rectangles.push(action.payload);
    },

    //*Catalog Prefabricated
    setPrefabricatedGondolas: (
      state,
      action: PayloadAction<PrefabricatedGondola[]>
    ) => {
      state.prefabricatedGondolas = action.payload;
    },
  },
});

export const {
  setCustomComercialArea,
  setCustomGondolaRectangles,
  setPrefabricatedComercialArea,
  setPrefabricatedGondolaRectangles,
  setPrefabricatedGondolas,
} = gondolaSlice.actions;
