import { useOne } from "@refinedev/core";
import { useParams } from "react-router-dom";
import { useGetIdentity } from "@refinedev/core";

import { Profile } from '../components'

const AgentProfile = () => {
  const { id } = useParams();
  const { data: user } = useGetIdentity();

const { query } = useOne({
    resource: "users",
    id: user?.id,
});

const { data, isLoading, isError } = query;
  console.log(data);

  const myProfile = data?.data ?? {};

  if (isLoading) return <div>loading...</div>;
  if (isError) return <div>error...</div>;

  return (
    <Profile
      type="Agent"
      name={myProfile.name}
      email={myProfile.email}
      avatar={myProfile.avatar}
      properties={myProfile.allProperties}
    />
  );
};

export default AgentProfile;