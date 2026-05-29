import { createSlice } from "@reduxjs/toolkit";

// This slice manages received connection requests. It handles:
// - setRequests: initial fetch from REST API
// - addRequests: real-time addition when request:received socket event arrives
// - removeRequest: when user accepts/rejects a request (via removeRequest(connectionId))
const requestsSlice = createSlice({
  name: "requests",
  initialState: [],
  reducers: {
    setRequests: (state, action) => {
      console.log("Setting requests:", action.payload);
      return action.payload;
    },
    // When a socket request:received arrives, add the full payload (includes connectionId, status, fromUser, createdAt)
    addRequests: (state, action) => {
      return [...state, action.payload];
    },
    // When user accepts/reject a request, remove it by connectionId
    removeRequest: (state, action) => {
      return state.filter((request) => request.connectionId !== action.payload);
    },
    // When request:reviewed arrives for a request WE sent, remove it from received list if present
    handleRequestReview: (state, action) => {
      // action.payload contains { connectionId, status, toUserId, toUser }
      // This removes the request from our received list if we had it (edge case if we sent and received at same time)
      return state.filter((request) => request.connectionId !== action.payload.connectionId);
    },
  },
});
export const { addRequests, removeRequest, setRequests, handleRequestReview } =
  requestsSlice.actions;
export default requestsSlice.reducer;
