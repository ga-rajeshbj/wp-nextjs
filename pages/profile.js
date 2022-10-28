import React from "react";
import { useSession } from "next-auth/react";

const profile = () => {
  const session = useSession();

  console.log(session);
  return <div>propfile</div>;
};

export default profile;
