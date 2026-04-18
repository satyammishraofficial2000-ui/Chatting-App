import { createSlice } from '@reduxjs/toolkit';
import { getAllChats } from '../apiCalls/chat';

const usersSlice = createSlice({
  name: 'user',
  initialState: { 
    user: null,
    allusers:[],
    allChats:[],
    selecteddChat: null
  },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },   // fixed name
    setAllUsers: (state, action) => { state.allusers = action.payload;},
    setAllChats: (state, action) => { state.allChats = action.payload;},
    setSelectedChat: (state, action) => { state.selectedChat = action.payload;},
  }
});

export const { setUser,setAllUsers,setAllChats, setSelectedChat  } = usersSlice.actions;
export default usersSlice.reducer;