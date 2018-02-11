import { createStore, combineReducers, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import authReducer from "../reducers/auth";
import navbarReducer from "../reducers/navbar";

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
    const store = createStore(
        combineReducers({
            auth: authReducer,
            navbar: navbarReducer
        }),
        composeEnhancers(applyMiddleware(thunk))
    );
    return store;
};
