import React from 'react';
import ReactDOM from 'react-dom';

import 'bulma/css/bulma.css'
import "./blog-bulma.css";
import './index.css';
import registerServiceWorker from './registerServiceWorker';
import AppRouter from "./routers/AppRouter";

ReactDOM.render(<AppRouter />, document.getElementById('root'));
registerServiceWorker();
