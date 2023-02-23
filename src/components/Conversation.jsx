import React from "react";
import Header from "../components/Header";
import History from "./History";
import Inputbox from "./Inputbox";

const Conversation = () => {
  return (
    <div className="conversation">
      <Header />
      <History />
      <Inputbox />
    </div>
  );
};

export default Conversation;
