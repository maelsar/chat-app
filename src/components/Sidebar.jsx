import React from "react";
import Navbar from "./Navbar";
import Search from "./Search";
import Contacts from "./Contacts";

const Sidebar = () => {
  return (
    <div className="sidebar">
      <Navbar />
      <Search />
      <Contacts />
    </div>
  );
};

export default Sidebar;
