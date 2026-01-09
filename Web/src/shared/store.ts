import { configureStore } from "@reduxjs/toolkit";
import { authSlice } from "./auth";
import { authController, billController, catalogController } from "../services";
import { catalogSlice } from "./catalog";
import { gondolaSlice } from "./gondola/gondolaSlice";
import { billSlice } from "./bill";

export const store = configureStore({
  reducer: {
    //*Auth
    auth: authSlice.reducer,
    //*Catalog
    catalog: catalogSlice.reducer,
    //*Gondola
    gondola: gondolaSlice.reducer,
    //*Bill
    bill: billSlice.reducer,
    //*Api
    [authController.reducerPath]: authController.reducer,
    [catalogController.reducerPath]: catalogController.reducer,
    [billController.reducerPath]: billController.reducer,
  },

  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    })
      .concat(authController.middleware)
      .concat(catalogController.middleware)
      .concat(billController.middleware),
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
