import React from "react";
import { useContext, useRef, useEffect } from "react";
import { Authentication } from "../context/Authentication";
import { ChatContext } from "../context/ChatContext";

const Message = ({ message }) => {
  const { currentUser } = useContext(Authentication);
  const { data } = useContext(ChatContext);
  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div
      ref={ref}
      className={`message ${message.senderID === currentUser.uid && "owner"}`}
    >
      <div className="messageInfo">
        <img
          src={
            message.senderID === currentUser.uid
              ? currentUser.photoURL
              : data.user.photoURL
          }
          alt=""
        />
        <span>
          {message.date
            .toDate()
            .toLocaleString(undefined, { month: "short", day: "numeric" })}
        </span>
        <span>
          {message.date
            .toDate()
            .toLocaleString(undefined, { hour: "2-digit", minute: "2-digit" })}
        </span>
      </div>
      <div className="messageContent">
        <p>{message.text}</p>
      </div>
    </div>
  );
};

export default Message;
