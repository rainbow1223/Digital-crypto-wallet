import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import "react-toastify/dist/ReactToastify.css";
// import { MoralisProvider } from "react-moralis";
import { ToastContainer } from "react-toastify";
import './my';

ReactDOM.render(
  <BrowserRouter>
    {/* <MoralisProvider
      appId={process.env.REACT_APP_MORALIS_APPID}
      serverUrl={process.env.REACT_APP_MORALIS_SERVERURL}
    > */}
    <Provider store={store}>
      <App />
      <ToastContainer />
    </Provider>
    {/* </MoralisProvider> */}
  </BrowserRouter>,
  document.getElementById("root")
);
