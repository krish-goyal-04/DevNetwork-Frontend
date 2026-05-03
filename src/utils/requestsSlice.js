import { createSlice } from "@reduxjs/toolkit";

// This slice is used to manage the state of connection requests in the application. It provides actions to add and remove requests from the state, allowing components to easily update the list of connection requests as needed.
const requestsSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    setRequests: (state, action) => {
      return action.payload;
    },
    addRequests: (state, action) => {
      return [...state, action.payload];
    },
    removeRequest: (state, action) => {
      return state.filter((request) => request.connectionId !== action.payload);
    },
  },
});
export const { addRequests, removeRequest, setRequests } =
  requestsSlice.actions;
export default requestsSlice.reducer;
