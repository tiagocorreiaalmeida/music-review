import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";

import "bulma/css/bulma.css";
import "./blog-bulma.css";
import "./index.css";
import registerServiceWorker from "./registerServiceWorker";
import configureStore from "./store/configureStore";
import AppRouter from "./routers/AppRouter";

const store = configureStore();

store.subscribe(() => {
    console.log(store.getState());
});

const jsx = (
    <Provider store={store}>
        <AppRouter />
    </Provider>
);

ReactDOM.render(jsx, document.getElementById("root"));
registerServiceWorker();
