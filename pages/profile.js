import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
// import login from './login';

const profile = () => {
  const session = useSession();
  const [user, setUser] = useState({});
  console.log(session.data?.user, session.status);

  useEffect(() => {
    if (session.status === "authenticated") {
      setUser(session.data.user);
    }
  });
  if (session.status === "authenticated") {
    return (
      <div>
        <h1>{user.username}</h1>
        <h1>{user.email}</h1>

        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  } else {
    return <div>you are not log in</div>;
  }
};

export default profile;
