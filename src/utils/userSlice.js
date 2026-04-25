import { createSlice } from "@reduxjs/toolkit";

//User SLice will manage all the state actions erlated to user, similarly for all other features we can create a slice and add actions and reducers
const userSlice = createSlice({
  name: "user",
  initialState: null,
  reducers: {
    addUser: (state, action) => {
      return action.payload;
    },
    removeUser: (state, action) => {
      return null;
    },
  },
});
console.log(userSlice);
export const { addUser, removeUser } = userSlice.actions;

export default userSlice.reducer;
