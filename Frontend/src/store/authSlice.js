import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
    name: "auth",
    initialState: {
        user: null,
        suggestedUsers:[],
        isLoggedIn:false
    },
    reducers: {
        setLoggedInUser: (state, action) => {
            state.user = action.payload,
            state.isLoggedIn = true
        },  
        logoutUser: (state, action) => {
            state.user = null;
            state.isLoggedIn = false
        },
        setSuggestedUsers:(state,action)=>{
            state.suggestedUsers = action.payload
        }

    }
})

export const { setLoggedInUser, logoutUser,setSuggestedUsers } = authSlice.actions;
export default authSlice.reducer;