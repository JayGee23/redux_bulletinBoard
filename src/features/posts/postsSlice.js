import { createSlice } from "@reduxjs/toolkit";

//initializing initial state for this "slice" of global state. Here hardcoding in two posts to start with.
const initialState = [
    {id: '1', title: 'Learning Redux Toolkit', content: "I've heard good things."},
    {id: '2', title: 'Slices...', content: "Slice of state? How about a slice of pizza?...."}
]


// .push is being used differently here. It DOES NOT mutate the state. You could also use spread operater instead. Only works in a 'slice'
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded(state, action) {
            state.push(action.payload)
        }
    }
})

export const selectAllPosts = (state) => state.posts

//exporting an action creator function. Automatically created when creating the reducer function above.
export const {postAdded} = postsSlice.actions

export default postsSlice.reducer