import { configureStore } from "@reduxjs/toolkit";
import postsReducer from "../features/posts/postsSlice";

//need to import reducers to the 'store' -> now it is available to entire app.
export const store = configureStore({
    reducer: {
        posts: postsReducer,
    }
})