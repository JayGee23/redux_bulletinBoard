import { configureStore } from "@reduxjs/toolkit";
import counterReducer from "../features/counter/counterSlice";

//need to import reducers to the 'store' -> now it is available to entire app.
export const store = configureStore({
    reducer: {
        counter: counterReducer,
    }
})