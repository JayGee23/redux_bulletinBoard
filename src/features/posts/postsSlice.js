import { createSlice, createAsyncThunk, createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import axios from "axios";
import { sub } from "date-fns";

const POSTS_URL = 'https://jsonplaceholder.typicode.com/posts'

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

//initializing initial state for this "slice" of global state. 
const initialState = postsAdapter.getInitialState({
    status: 'idle', //idle, loading, succeded or failed
    error: null,
    count: 0
}) 

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
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1
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
                postsAdapter.upsertMany(state, loadedPosts)
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
                //action.payload is the new post
                console.log(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log('Update could not complete')
                    console.log(action.payload)
                    return
                }

                action.payload.date = new Date().toISOString()
                postsAdapter.upsertOne(state, action.payload)
            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if(!action.payload?.id) {
                    console.log('Delete could not be completed')
                    console.log(action.payload)
                    return
                }
                const {id} = action.payload
                postsAdapter.removeOne(state, id)
            })
    }
})

//getSelectors creates these selectors and we rename them using destructuring
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds

    //pass in a selector that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count


export const selectPostsByUser = createSelector(
    [selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId)
    )

//exporting an action creator function. Automatically created when creating the reducer function above.
export const { increaseCount, reactionAdded } = postsSlice.actions

export default postsSlice.reducer