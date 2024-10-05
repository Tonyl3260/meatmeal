import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { auth } from "../../../../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";

// Async thunk to listen to auth state changes
export const listenToAuthChanges = createAsyncThunk(
  "auth/listenToAuthChanges",
  async (_, { dispatch }) => {
    return new Promise((resolve, reject) => {
      const unsubscribe = onAuthStateChanged(
        auth,
        (user) => {
          console.log("AUTH STATE CHANGED...");
          console.log("_______________________________________________________________");
          console.log(auth.currentUser);

          if (user) {
            // If the user is logged in, set the authenticated state and stop loading
            dispatch(
              setAuthState({
                isAuthenticated: true,
                isLoading: false,  // Set loading to false
                user: {
                  uid: user.uid,
                  email: user.email,
                  displayName: user.displayName,
                },
              })
            );
          } else {
            // If no user is logged in, reset the auth state and stop loading
            console.log("No user is logged in");
            dispatch(
              setAuthState({
                isAuthenticated: false,
                isLoading: false,  // Set loading to false
                user: null,
              })
            );
          }
          resolve();
        },
        (error) => {
          console.error("Auth state change error", error);
          reject(error);
        }
      );

      // Unsubscribe from the listener when it's no longer needed
      return unsubscribe;
    });
  }
);

// Auth slice definition
export const authSlice = createSlice({
  name: "auth",
  initialState: {
    isAuthenticated: false,
    isLoading: true,  // Start with loading set to true
    user: null,
  },
  reducers: {
    setAuthState: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.isLoading = action.payload.isLoading;
      state.user = action.payload.user;
    },
  },
});

export const { setAuthState } = authSlice.actions;
export default authSlice.reducer;
