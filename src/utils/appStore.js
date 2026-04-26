import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import feedReducer from "./feedSlice";
//This creates an redux store which is single source of truth
//It has to given to provider in app, so that it becomes global and all the componenets inside <App /> can access in main.jsx

const appStore = configureStore({
  reducer: {
    user: userReducer,
    feed: feedReducer,
    //this userReducer is the userSlice.reducer function, which take state and action as parameters
  },
});

export default appStore;
