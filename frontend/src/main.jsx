import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { createStore } from "redux"; // createStore method for creating a redux store
import { Provider } from "react-redux"; // get the provider component to wrap it into whole app
import rootReducer from "./redux/reducers/rootReducer.jsx";

const store = createStore(rootReducer);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <App />
      </Provider>
    </BrowserRouter>
  </React.StrictMode>
);
