import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "./routes";
import { RootState } from "../../../shared";

const credentials = "11190097:60-dayfreetrial";

export const baseApiConfig = fetchBaseQuery({
  baseUrl: BASE_URL,
  prepareHeaders: (headers, { getState }) => {
    headers.set("Accept", "application/json");
    headers.set("Authorization", `Basic ${btoa(credentials)}`);
    headers.set(
      "X-JWT-Token",
      `Bearer ${(getState() as RootState).auth.jwtInfo.token}`
    );
    return headers;
  },
  validateStatus: (response, _result) => {
    return response.status >= 200 && response.status < 300;
  },
  fetchFn: async (url, options) => {
    try {
      const response = await fetch(url, {
        ...options,
        credentials: "include", // Incluye las credenciales si es necesario
      });
      return response;
    } catch (error) {
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        alert(
          "No se puede conectar al servidor. Por favor, encienda el servidor."
        );
      }
      throw error;
    }
  },
});
