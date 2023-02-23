import React from "react";
import { useContext } from "react";
import { auth } from "../firebaseconfig";
import { signOut } from "firebase/auth";
import { Authentication } from "../context/Authentication";

const Navbar = () => {
  const { currentUser } = useContext(Authentication);
  return (
    <div className="navbar">
      <span className="logo">Ploky Chat</span>
      <div className="user">
        <img src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={() => signOut(auth)}>Logout</button>
      </div>
    </div>
  );
};

export default Navbar;
