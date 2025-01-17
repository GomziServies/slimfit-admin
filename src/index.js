import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

//router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
//store
import { Provider } from "react-redux";
//reducer
import { store } from "./store";

import Default from './layouts/dashboard/default';
import { IndexRouters } from "./router";
import { SimpleRouter } from "./router/simple-router";
import { DefaultRouter } from "./router/default-router";
import Protect from "./views/dashboard/components/Protect";
import PageNotFound from "./views/dashboard/page-not-found";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protect>
        <Default />
      </Protect>
    ),
  },
  ...DefaultRouter,
  ...IndexRouters,
  ...SimpleRouter,
  {
    path: "*",
    element: <PageNotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
