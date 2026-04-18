import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'user',
  initialState: { user: null,allusers:[] },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },   // fixed name
    setAllUsers: (state, action) => { state.allusers = action.payload;},
  }
});

export const { setUser,setAllUsers  } = usersSlice.actions;
export default usersSlice.reducer;