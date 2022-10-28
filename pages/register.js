import React, { useState } from "react";
import { signIn, useSession } from "next-auth/react";

const register = () => {
  const [userName, setUserName] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const response = await signIn("wpRegister", {
      firstName,
      lastName,
      email,
      password,
      userName,
      redirect: false,
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
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          placeholder="enter first name"
        />{" "}
        <br />
        <input
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          placeholder="enter last name"
        />{" "}
        <br />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="enter  password"
        />{" "}
        <br />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="enter user email"
        />{" "}
        <br />
        <button type="submit">create user</button>
      </form>
    </div>
  );
};

export default register;
