import { createApi } from "@reduxjs/toolkit/query/react";
import { COTIZACION_BASE_URL, baseApiConfig } from "../config";
import { BillApi, BillApiHistory } from "../../../project";

export const billController = createApi({
  reducerPath: "billController",
  baseQuery: baseApiConfig,
  tagTypes: ["bill"],
  refetchOnFocus: true,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    getBillHistory: build.query<BillApiHistory[], void>({
      query: () => ({
        url: COTIZACION_BASE_URL,
      }),
    }),

    postBill: build.mutation<void, BillApi>({
      query: (body) => ({
        url: COTIZACION_BASE_URL,
        method: "POST",
        body,
      }),
    }),
  }),
});

export const { useLazyGetBillHistoryQuery, usePostBillMutation } =
  billController;
