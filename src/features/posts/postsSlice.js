import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

//initializing initial state for this "slice" of global state. 
const initialState = {
    posts: [],
    status: 'idle', //idle, loading, succeded or failed
    error: null
}

//async functions for CRUD operations - Get/Create/Update/Delete
export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    const response = await axios.get(POSTS_URL)
    return response.data
})

export const addNewPost = createAsyncThunk('posts/addNewPost', async (initialPost) => {
    const response = await axios.post(POSTS_URL, initialPost)
    return response.data
})

export const updatePost = createAsyncThunk('posts/updatePost', async (initialPost) => {
    const { id } = initialPost

    try {
        const response = await axios.put(`${POSTS_URL}/${id}`, initialPost)
        return response.data

    } catch (err) {
        //return err.message
        //because we are using fake api we can't actually update the posts
        return initialPost // only for testing redux
    }
})

export const deletePost = createAsyncThunk('posts/deletePost', async (initialPost) => {
    const { id } = initialPost

    try {
        const response = await axios.delete(`${POSTS_URL}/${id}`)
        if(response?.status === 200) {
            return initialPost
        }

        return `${response?.status}: ${response?.statusText}`

    } catch (err) {
        return err.message
    }
})



// .push is being used differently here. It DOES NOT mutate the state. You could also use spread operater instead. Only works in a 'slice'
const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
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
            const { postId, reaction } = action.payload
            const existingPost = state.posts.find(post => post.id === postId)
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        }
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = 'loading'
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = 'succeeded'
                //adding date and reactions
                let min = 1
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString()
                    post.reactions = {
                        thumbsUp: 0,
                        wow: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0
                    }
                    return post
                })

                //add any fetched posts to the array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = 'failed'
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {

                //fix for post ids; wouldn't be needed if api data had accurate data instead of fake data.
                const sortedPosts = state.posts.sort((a, b) => {
                    if (a.id > b.id) return 1
                    if (a.id < b.id) return -1
                    return 0
                })
                action.payload.id = sortedPosts[sortedPosts.length - 1].id + 1
                // end fix

                action.payload.userId = Number(action.payload.userId)
                action.payload.date = new Date().toISOString()
                action.payload.reactions = {
                    thumbsUp: 0,
                    wow: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0
                }
                console.log(action.payload)
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }

                const { id } = action.payload
                action.payload.date = new Date().toISOString()
                const posts = state.posts.filter(post => post.id !== id)
                state.posts = [...posts, action.payload]
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log('Delete could not be completed')
                    console.log(action.payload)
                    return
                }
                const {id} = action.payload
                const posts = state.posts.filter(post => post.id !== id)
                state.posts = posts
            })
    }
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostById = (state, postId) => {
    return state.posts.posts.find(post => post.id === postId)
}

//exporting an action creator function. Automatically created when creating the reducer function above.
export const { postAdded, reactionAdded } = postsSlice.actions

export default postsSlice.reducer