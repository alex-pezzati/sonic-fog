import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './App';

import configureStore from './store';
import * as modalActions from './store/modal';
import './index.css';

const store = configureStore();

if (process.env.NODE_ENV !== 'production') {
  window.store = store;
  window.modalActions = modalActions;
}

const Root = () => (
  <Provider store={store}>
    <App />
  </Provider>
)

ReactDOM.render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>,
  document.getElementById('root')
);
