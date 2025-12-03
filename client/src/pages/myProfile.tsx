import React from 'react';
import { useGetIdentity, useOne } from '@refinedev/core';
import { Profile } from '../components';

const MyProfile = () => {
  const { data: user } = useGetIdentity();

  const { query, result } = useOne({
    resource: "users",
    id: user?._id ?? "",
  });

  if (query.isLoading) return <div>Loading...</div>;
  if (query.isError) return <div>Error occurred</div>;

  const userProfile = result; // <-- use 'result' instead of query.data?.data
  console.log(userProfile);

  return (
    <div>
      <Profile
        type="my"
        name={userProfile?.name}
        email={userProfile?.email}
        avatar={userProfile?.avatar}
        properties={userProfile?.allProperties ?? []}
      />
    </div>
  );
};

export default MyProfile;
