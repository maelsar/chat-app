import React from "react";
import Add from "../img/add.png";
import { ChatContext } from "../context/ChatContext";
import { useContext } from "react";

const Header = () => {
  const { data } = useContext(ChatContext);
  return (
    <div className="header">
      <div className="headerInfo">
        <span>{data.user?.displayName}</span>
        <div className="optionIcon">
          <img src={Add} alt="" />
        </div>
      </div>
    </div>
  );
};

export default Header;
