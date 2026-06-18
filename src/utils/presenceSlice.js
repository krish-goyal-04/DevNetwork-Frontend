import { createSlice } from "@reduxjs/toolkit";

const presenceSlice = createSlice({
  name: "presence",
  initialState: {},
  reducers: {
    setUserOnline(state, action) {
      state[action.payload.userId] = true;
    },
    setUserOffline(state, action) {
      state[action.payload.userId] = false;
    },
    setPresenceState(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { setUserOnline, setUserOffline, setPresenceState } = presenceSlice.actions;
export default presenceSlice.reducer;
