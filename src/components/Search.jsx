import React from "react";
import { useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseconfig";
import { Authentication } from "../context/Authentication";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { useContext } from "react";
import { serverTimestamp } from "firebase/database";

const Search = () => {
  const [username, setUsername] = useState("");
  const [user, setUser] = useState(null);
  const [err, setErr] = useState(false);
  const [userSearch, setuserSearch] = useState("");

  const { currentUser } = useContext(Authentication);

  const handleSearch = async () => {
    if (username !== currentUser.displayName) {
      setuserSearch(username);
    } else {
      setuserSearch(" ");
    }

    const q = query(
      collection(db, "users"),
      where("displayName", "==", userSearch)
    );
    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data());
      });
    } catch (err) {
      setErr(true);
      console.log("failed");
    }
  };
  const handleKey = (e) => {
    e.key === "Enter" && handleSearch();
  };

  const handleSelect = async () => {
    //check if conversation exists - if not then create
    const combinedID =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;
    try {
      const res = await getDoc(doc(db, "conversation", combinedID));
      //check
      //checkend
      if (!res.exists()) {
        //create a conversation collection
        await setDoc(doc(db, "conversation", combinedID), { messages: [] });

        //create userChats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedID + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
          //add the notification flag
          [combinedID + ".lastMessage"]: {
            receiverHasClicked: false,
          },
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedID + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            photoURL: currentUser.photoURL,
          },
          [combinedID + ".date"]: serverTimestamp(),
          //add the notification flag
          [combinedID + ".lastMessage"]: {
            receiverHasClicked: false,
          },
        });
      }
    } catch (err) {
      setErr(true);
    }

    setUser(null);
    setUsername("");
  };

  return (
    <div className="search">
      <div className="searchForm">
        <input
          type="text"
          placeholder="find someone..."
          onKeyDown={handleKey}
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
      </div>
      {err && <span>User not found...</span>}
      {user && (
        <div className="userChat" onClick={handleSelect}>
          <img src={user.photoURL} alt="" />
          <div className="userChatInfo">
            <span>{user.displayName}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
