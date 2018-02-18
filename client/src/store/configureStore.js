import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from "../reducers/auth";
import navbarReducer from "../reducers/navbar";
import myPostsReducer from "../reducers/myPosts";
import messagesReducer from "../reducers/messages";
import postsReducer from "../reducers/posts";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            navbar: navbarReducer,
            myPosts: myPostsReducer,
            posts: postsReducer,
            messages: messagesReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};
