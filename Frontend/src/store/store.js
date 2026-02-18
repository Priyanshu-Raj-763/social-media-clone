import { configureStore, combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
    persistReducer,
    persistStore,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER
} from "redux-persist";
import authReducer from "./authSlice.js";
import postReducer from "./postSlice.js"
import themeReducer from "./themeSlice.js"
import socketReducer from "./socketSlice.js"
import chatReducer from "./chatSlice.js"
import RTNReducer from "./RTNSlice.js"

const persistConfig = {
    key: "root",
    version: 1,
    storage,
    whitelist: ["auth", "theme"] // only persist important slices
};

const rootReducer = combineReducers({
    auth: authReducer,
    post: postReducer,
    theme: themeReducer,
    chat: chatReducer,
    realTimeNotification: RTNReducer
})
const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER
                ]
            }
        })
});

export const persistor = persistStore(store);