import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter } from "react-router-dom";
import { createStore } from 'redux';
import rootReducer from 'redux/root-reducer';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createSetAuthTokenAction, createSetUidAction, cresteSetUauthorityAction } from 'redux/auth-reducer';
import { addAuthHeader } from 'apis/axiosConfig';
import { Provider } from 'react-redux';
import { createSetHaddressAction, createSetHidAction, createSetHLATAction, createSetHLONGAction, createSetHnameAction, createSetHurlAction } from 'redux/hospital-reducer';

const store = createStore(rootReducer, composeWithDevTools());

store.dispatch(createSetUidAction(sessionStorage.getItem("uid") || ""));
store.dispatch(createSetAuthTokenAction(sessionStorage.getItem("authToken") || ""));
store.dispatch(cresteSetUauthorityAction(sessionStorage.getItem("uauthority") || ""));
store.dispatch(createSetHnameAction(sessionStorage.getItem("hname" || "")));
store.dispatch(createSetHidAction(sessionStorage.getItem("hid") || ""));
store.dispatch(createSetHaddressAction(sessionStorage.getItem("haddress") || ""));
store.dispatch(createSetHurlAction(sessionStorage.getItem("hurl" || "")));
store.dispatch(createSetHLATAction(sessionStorage.getItem("hlat" || "")));
store.dispatch(createSetHLONGAction(sessionStorage.getItem("hlong" || "")));

if (sessionStorage.getItem("authToken")) {
  addAuthHeader(sessionStorage.getItem("authToken"));
}

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
