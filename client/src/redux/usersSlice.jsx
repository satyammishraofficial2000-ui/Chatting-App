import { createSlice } from '@reduxjs/toolkit';
import { getAllChats } from '../apiCalls/chat';

const usersSlice = createSlice({
  name: 'user',
  initialState: { 
    user: null,
    allusers:[],
    allChats:[],
  },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },   // fixed name
    setAllUsers: (state, action) => { state.allusers = action.payload;},
    setAllChats: (state, action) => { state.allChats = action.payload;},
  }
});

export const { setUser,setAllUsers,setAllChats  } = usersSlice.actions;
export default usersSlice.reducer;