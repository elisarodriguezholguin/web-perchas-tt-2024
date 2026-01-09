import { createApi } from "@reduxjs/toolkit/query/react";
import { SECURITY_ENDPOINTS, baseApiConfig } from "../config";
import { JWTInfo, LoginInfo, RegisterInfo } from "../../../auth";

export const authController = createApi({
  reducerPath: "authController",
  baseQuery: baseApiConfig,
  tagTypes: ["Auth"],
  refetchOnFocus: true,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    //POST
    postLogIn: build.mutation<JWTInfo, LoginInfo>({
      query: (body) => ({
        url: SECURITY_ENDPOINTS.LOGIN,
        method: "POST",
        body,
      }),
    }),
    postRegisterUser: build.mutation<JWTInfo, RegisterInfo>({
      query: (body) => ({
        url: SECURITY_ENDPOINTS.REGISTER,
        method: "POST",
        body,
      }),
    }),
    patchUpdateUserInfo: build.mutation<
      JWTInfo,
      { jwtInfo: JWTInfo; username: string }
    >({
      query: (body) => ({
        url: SECURITY_ENDPOINTS.UPDATE_USER_INFO,
        method: "PATCH",
        body: body.jwtInfo,
        params: { username: body.username },
      }),
    }),
  }),
});

export const {
  usePostLogInMutation,
  usePostRegisterUserMutation,
  usePatchUpdateUserInfoMutation,
} = authController;
