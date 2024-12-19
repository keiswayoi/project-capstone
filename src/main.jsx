import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import store from "./redux/store";
import App from "./App"; // Pastikan path sesuai dengan lokasi file App.jsx
import "bootstrap/dist/css/bootstrap.min.css"; // Opsional jika menggunakan Bootstrap

const root = ReactDOM.createRoot(document.getElementById("root")); // Pastikan elemen #root ada di index.html
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </Provider>
);
