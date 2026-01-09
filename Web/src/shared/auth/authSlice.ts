import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthInfo, JWTInfo } from "../../auth";

const initialState: AuthInfo = {
  status: "checking",
  jwtInfo: {
    token: "",
    expiracion: "",
    firstName: "",
    lastName: "",
    userName: "",
    rolName: "Administrador",
    direccion: "",
    cedula: "",
    telefono: "",
    visitedInstruction: false,
  },
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    checking: (state) => {
      state.status = "checking";
    },
    login: (state, action: PayloadAction<JWTInfo>) => {
      state.status = "authenticated";
      state.jwtInfo = action.payload;
    },
    logout: (state) => {
      state.status = "not-authenticated";
      state.jwtInfo = initialState.jwtInfo;
    },
    setUpdateUserInfo: (state, action: PayloadAction<JWTInfo>) => {
      state.jwtInfo = {
        ...state.jwtInfo,
        firstName: action.payload.firstName,
        lastName: action.payload.lastName,
        userName: action.payload.userName,
        direccion: action.payload.direccion,
        cedula: action.payload.cedula,
        telefono: action.payload.telefono,
      };
    },
    setVisitedInstruction: (state) => {
      state.jwtInfo.visitedInstruction = true;
    },
  },
});

export const {
  login,
  logout,
  checking,
  setUpdateUserInfo,
  setVisitedInstruction,
} = authSlice.actions;
