import React from "react";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { useEffect, useState, useContext } from "react";
import { db } from "../firebaseconfig";
import { Authentication } from "../context/Authentication";
import { ChatContext } from "../context/ChatContext";
import Notification from "../img/bell.png";
import Bin from "../img/bin.png";

const Contacts = () => {
  const [chats, setChats] = useState([]);
  const { currentUser } = useContext(Authentication);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, "userChats", currentUser.uid), (doc) => {
        setChats(doc.data());
      });
      return () => {
        unsub();
      };
    };
    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: "CHANGE_USER", payload: u });

    const combinedID =
      currentUser.uid > u.uid
        ? currentUser.uid + u.uid
        : u.uid + currentUser.uid;
    updateNotification(combinedID);
  };
  //update Notification
  const updateNotification = async (combinedID) => {
    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [combinedID + ".lastMessage"]: {
        receiverHasClicked: true,
      },
    });
  };
  //delete a conversation
  /*   TOFOLLOW
  const deleteConvo = async (combinedID) => {
    const convo = doc(db, "userChats", currentUser.uid)
    await updateDoc(convo.combinedID, remove())
    .then(() => {
      console.log("Deleted")
    })
  }
  */

  return (
    <div className="contacts">
      {Object.entries(chats)
        ?.sort((a, b) => b[1].date - a[1].date)
        .map((chat) => (
          <div
            className="userChat"
            key={chat[0]}
            onClick={() => {
              handleSelect(chat[1].userInfo);
            }}
          >
            <img src={chat[1].userInfo.photoURL} alt="" />
            <div className="userChatInfo">
              <span>{chat[1].userInfo.displayName}</span>
              <p>{chat[1].lastMessage?.text}</p>
            </div>
            {chat[1].lastMessage?.receiverHasClicked === false &&
            chat[1].userInfo.uid === chat[1].lastMessage?.sender ? (
              <div className="notificationicon">
                <img src={Notification} alt="" />
              </div>
            ) : null}
            <div className="delete">
              <img src={Bin} alt="" /*onClick={()=>{deleteConvo()}}*/ />
            </div>
          </div>
        ))}
    </div>
  );
};

export default Contacts;
