import React from "react";
import ReactDOM from "react-dom";
import Modal from "react-modal";
import "./styles/fontFaces.css";

import App from "./App";

import * as serviceWorker from "./serviceWorker";
import { ApolloProvider } from "@apollo/react-hooks";
import { ThemeProvider } from "styled-components";

import client from "graphql/client";
import theme from "styles/theme";
import NotificationsWithPortal from "./NotificationWithPortal";

Modal.setAppElement("#root");

ReactDOM.render(
  <React.StrictMode>
    <NotificationsWithPortal />
    <ApolloProvider client={client}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
