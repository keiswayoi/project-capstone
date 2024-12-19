import { configureStore } from "@reduxjs/toolkit";
import globalDataReducer from "./slice";

const store = configureStore({
  reducer: {
    globalData: globalDataReducer,
  },
});

export default store;
