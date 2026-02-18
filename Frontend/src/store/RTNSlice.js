import { createSlice } from "@reduxjs/toolkit";

const RTNSlice = createSlice({
    name:"realTimeNotification",
    initialState:{
        likeNotification:[]
    },
    reducers:{
        setNotification:(state,action)=>{
            if(action.payload.type ==="like"){
                state.likeNotification.push((action.payload))
            }else if(action.payload.type ==="dislike"){
                state.likeNotification = state.likeNotification.filter((noti)=>noti.userId !== action.payload.userId)
            }
        }
    }
})

export const {setNotification} = RTNSlice.actions;
export default RTNSlice.reducer;