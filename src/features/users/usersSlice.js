import { createSlice } from "@reduxjs/toolkit";

const initialState = [
    { id: '0', name: 'Josh Grohl' },
    { id: '1', name: 'Dave Reznor' },
    { id: '2', name: 'Trent Homme' },
]

const usersSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {

    }
})

export const selectAllUsers = (state) => state.users

export default usersSlice.reducer