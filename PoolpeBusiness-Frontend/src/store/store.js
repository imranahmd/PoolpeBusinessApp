// store.js

import {configureStore} from '@reduxjs/toolkit';
import usersReducer from '../reducers/userSlice'; // Create this slice

export default configureStore({
  reducer: {
    users: usersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }),
});
