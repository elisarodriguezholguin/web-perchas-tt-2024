import { createApi } from "@reduxjs/toolkit/query/react";
import { CATALOGO_BASE_URL, baseApiConfig } from "../config";
import { Catalog, Item } from "../../../project";

export const catalogController = createApi({
  reducerPath: "catalogController",
  baseQuery: baseApiConfig,
  tagTypes: ["Cat"],
  refetchOnFocus: true,
  keepUnusedDataFor: 10,
  endpoints: (build) => ({
    //Get
    getCatalogs: build.query<Catalog[], void>({
      query: () => ({
        url: CATALOGO_BASE_URL,
      }),
      providesTags: ["Cat"],
    }),
    postCatalog: build.mutation<void, { catalogo: string; item: Item }>({
      query: (body) => ({
        url: CATALOGO_BASE_URL,
        params: { catalogo: body.catalogo },
        body: body.item,
        method: "POST",
      }),
    }),
  }),
});

export const { useLazyGetCatalogsQuery, usePostCatalogMutation } =
  catalogController;
