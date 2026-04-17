import { createSlice } from '@reduxjs/toolkit';

const usersSlice = createSlice({
  name: 'user',
  initialState: { user: null },
  reducers: {
    setUser: (state, action) => { state.user = action.payload; },   // fixed name
  }
});

export const { setUser } = usersSlice.actions;
export default usersSlice.reducer;