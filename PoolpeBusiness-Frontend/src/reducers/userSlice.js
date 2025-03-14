// usersSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  usersData: [], // Array to store registered users' data
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    registerUser(state, action) {
      state.usersData.push(action.payload);
    },
  },
});

export const { registerUser } = usersSlice.actions;

export default usersSlice.reducer;
