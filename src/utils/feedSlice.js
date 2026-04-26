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
  },
});

export const { addFeed, removeFeed } = feedSlice.actions;

export default feedSlice.reducer;
