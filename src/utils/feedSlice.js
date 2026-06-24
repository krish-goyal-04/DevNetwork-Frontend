import { createSlice } from "@reduxjs/toolkit";

// This slice is used to store the feed data in the redux store. It is used to display the feed data in the feed page.

const feedSlice = createSlice({
  name: "feed",
  initialState: null,
  reducers: {
    addFeed: (_state, action) => {
      return action.payload;
    },
    removeFeed: () => {
      return null;
    },
    appendFeed: (state, action) => {
      if (!state) return action.payload;
      const existingIds = new Set(state.map((item) => item._id));
      const newItems = action.payload.filter(
        (item) => !existingIds.has(item._id),
      );
      return [...state, ...newItems];
    },
    removeUserFromFeed: (state, action) => {
      const userIdToRemove = action.payload;
      if (!state) return state;
      return state.filter((user) => user._id !== userIdToRemove);
    },
  },
});

export const { addFeed, removeFeed, appendFeed, removeUserFromFeed } =
  feedSlice.actions;

export default feedSlice.reducer;
