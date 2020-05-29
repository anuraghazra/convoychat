import React from "react";
import { useListUsersQuery } from "../../generated/graphql";

const Dashboard = () => {
  const { data: users, loading, error } = useListUsersQuery();

  return (
    <div>
      <p>Dashboard</p>

      {JSON.stringify(users)}
    </div>
  );
};

export default Dashboard;
