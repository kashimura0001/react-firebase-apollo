import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorker from "./serviceWorker";
import firebase from "./Firebase";
import "ress";

import { App } from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { BrowserRouter } from "react-router-dom";
import { setContext } from "@apollo/client/link/context";

const httpLink = createHttpLink({
  uri: "http://localhost:3000/graphql",
});

const authLink = setContext(async (_, { headers }) => {
  const token = await firebase.auth().currentUser?.getIdToken(true);
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById("root")
);

serviceWorker.unregister();
