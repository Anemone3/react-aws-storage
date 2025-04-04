import { createSlice } from "@reduxjs/toolkit";

const INITIAL_STATE = {
  authenticate: "not-authenticate",
  user: null,
  accessToken: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState: INITIAL_STATE,
  reducers: {
    setAuthenticate: (state, { payload }) => {
      state.user = payload?.user;
      state.authenticate = "authenticate";
      state.accessToken = payload?.accessToken;
    },
    clearAuthenticate: (state) => {
      state.accessToken = null;
      state.user = null;
      state.authenticate = "not-authenticate";
    },
  },
});

export const { clearAuthenticate, setAuthenticate } = authSlice.actions;
