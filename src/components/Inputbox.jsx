import React from "react";
import Send from "../img/mail.png";
import { Authentication } from "../context/Authentication";
import { ChatContext } from "../context/ChatContext";
import { useContext, useState } from "react";
import {
  arrayUnion,
  doc,
  updateDoc,
  Timestamp,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseconfig";
import { v4 as uuid } from "uuid";

const Inputbox = () => {
  const [text, setText] = useState("");
  const { currentUser } = useContext(Authentication);
  const { data } = useContext(ChatContext);
  const setcheck = { data }.chatID;

  const updateNotification = async () => {
    if (data.chatID !== "null") {
      await updateDoc(doc(db, "userChats", currentUser.uid), {
        [data.chatID + ".lastMessage"]: {
          receiverHasClicked: true,
        },
      });
    } else {
    }
  };

  console.log(setcheck);

  const handleKey = (e) => {
    e.code === "Enter" && handleSend();
  };

  const handleSend = async () => {
    if (text) {
      setText("");
      await updateDoc(doc(db, "conversation", data.chatID), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderID: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
        receiverHasClicked: false,
        sender: currentUser.uid,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });
    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatID + ".lastMessage"]: {
        text,
        receiverHasClicked: false,
        sender: currentUser.uid,
      },
      [data.chatID + ".date"]: serverTimestamp(),
    });
  };
  return (
    <div className="typebox">
      <input
        type="text"
        placeholder="type something..."
        onChange={(e) => setText(e.target.value)}
        onClick={() => updateNotification()}
        onKeyDown={handleKey}
        value={text}
      />
      <div className="send">
        <button onClick={handleSend}>
          <img src={Send} alt="" />
        </button>
      </div>
    </div>
  );
};

export default Inputbox;
