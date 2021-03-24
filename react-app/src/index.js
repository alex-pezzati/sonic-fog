import React from 'react';
import ReactDOM from 'react-dom';
<<<<<<< HEAD
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
=======
import { Provider as ReduxProvider } from 'react-redux';
import './index.css';
import App from './App';

import configureStore from './store';


const store = configureStore();


ReactDOM.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <App />
    </ReduxProvider>
>>>>>>> 24faa460ab931b88268e6a5010d02a0095411302
  </React.StrictMode>,
  document.getElementById('root')
);
