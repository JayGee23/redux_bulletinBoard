import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    count: 0
}

//reducer object has 'actions'-> an action function to increment and an action function to decrement
export const counterSlice = createSlice({
    name: 'counter',
    initialState,
    reducers: {
        increment: (state) => {
            state.count += 1
        },
        decrement: (state) => {
            state.count -= 1
        },
        reset: (state) => {
            state.count = 0
        },
        incrementByAmount: (state, action) => {
            state.count += action.payload
        }
    }
})

// need to export both the actions and the reducer object
export const { increment, decrement, reset, incrementByAmount } = counterSlice.actions

export default counterSlice.reducer