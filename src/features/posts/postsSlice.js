import { createSlice, nanoid } from "@reduxjs/toolkit";
import { sub } from "date-fns";

//initializing initial state for this "slice" of global state. Here hardcoding in two posts to start with.
const initialState = [
    {
        id: '1', 
        title: 'Learning Redux Toolkit', 
        content: "I've heard good things.", 
        date: sub(new Date(), {minutes: 10}).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
        }
    },
    {
        id: '2', 
        title: 'Slices...', 
        content: "Slice of state? How about a slice of pizza?....", 
        date: sub(new Date(), {minutes: 5}).toISOString(),
        reactions: {
            thumbsUp: 0,
            wow: 0,
            heart: 0,
            rocket: 0,
            coffee: 0,
        }
    },
]


// .push is being used differently here. It DOES NOT mutate the state. You could also use spread operater instead. Only works in a 'slice'
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            wow: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0,
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const {postId, reaction} = action.payload
            const existingPost = state.find(post => post.id === postId)
            if(existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    }
})

export const selectAllPosts = (state) => state.posts

//exporting an action creator function. Automatically created when creating the reducer function above.
export const {postAdded, reactionAdded} = postsSlice.actions

export default postsSlice.reducer