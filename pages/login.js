import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const login = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(userName, password);
    const response = await signIn("wpLogin", {
      userName,
      password,
      redirect: true,
      callbackUrl: `${window.location.origin}`,
    });
    console.log(response);

    if (response.error) {
      alert(response.error);
    }
  };
  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          placeholder="enter user name"
        />{" "}
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter  password"
        />{" "}
        <br />
        <button type="submit">login</button>
      </form>
    </div>
  );
};

export default login;
