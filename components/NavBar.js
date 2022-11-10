import Link from "next/link";
import React, { useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import SearchBar from "./SearchBar";

const NavBar = () => {
  const [login, setLogIn] = useState(false);
  const session = useSession();
  console.log(session);
  useEffect(() => {
    if (session.data?.user) {
      setLogIn(true);
    } else {
      setLogIn(false);
    }
  }, []);
  return (
    <div>
      <Link href="/">
        <a>home</a>
      </Link>
      <Link href="/profile">
        <a>profile </a>
      </Link>
      <SearchBar />
    </div>
  );
};

export default NavBar;
