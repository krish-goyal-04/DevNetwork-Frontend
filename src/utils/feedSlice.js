import { createSlice } from "@reduxjs/toolkit";

// This slice is used to store the feed data in the redux store. It is used to display the feed data in the feed page.

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (state, action) => {
      return action.payload;
    },
    removeFeed: (state, action) => {
      return null;
    },
    removeUserFromFeed: (state, action) => {
      const userIdToRemove = action.payload;
      if (!state) return state;
      return state.filter((user) => user._id !== userIdToRemove);
    },
  },
});

export const { addFeed, removeFeed, removeUserFromFeed } = feedSlice.actions;

export default feedSlice.reducer;
