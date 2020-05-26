import React from "react";
import { useListUsersQuery } from "./generated/graphql";

function App() {
  const { data: users, loading, error } = useListUsersQuery();

  console.log(users);
  return <div className="App">hello world</div>;
}

export default App;
