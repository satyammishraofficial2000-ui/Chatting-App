import { useSelector,useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import {clearUnreadMessages} from "../../../apiCalls/chat";



function ChatArea(){

  const dispatch = useDispatch();
  const { selectedChat, user, allusers,allChats } = useSelector((state) => state.usersReducer);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);


  // Prevent crash when page loads
  if (!selectedChat) {
    return <div className="app-chat-area"></div>;
  }

  // get the other user's id from chat members
  const otherUserId = selectedChat.members.find(
    member => (member._id ? member._id : member) !== user._id
  );

  // find full user details from allusers
  const selectedUser = allusers.find(
    u => u._id === (otherUserId._id ? otherUserId._id : otherUserId)
  );

  const sendMessage = async () => {
    try{
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message
      };

      dispatch(showLoader());
      const response = await createNewMessage(newMessage);
      dispatch(hideLoader());

      if(response.success){
        toast.success(response.message);
        setMessage("");
      }
    }catch(error){
      dispatch(hideLoader());
      toast.error(error.message);
    }
  };

const formateTime = (timestamp) => {
  if (!timestamp) return "";

  const messageTime = moment(timestamp);

  if (messageTime.isSame(moment(), "day")) {
    return `Today ${messageTime.format("hh:mm A")}`;
  }

  if (messageTime.isSame(moment().subtract(1, "day"), "day")) {
    return `Yesterday ${messageTime.format("hh:mm A")}`;
  }

  return messageTime.format("MMM Do YYYY, hh:mm A");
};
const getMessages = async () => {
  try{

    dispatch(showLoader());
    const response = await getAllMessages(selectedChat._id);
    dispatch(hideLoader());

    if(response.success){
      setAllMessages(response.data);
    }

  }catch(error){
    dispatch(hideLoader());
    toast.error(error.message);
  }
};

const clearUnreadMessage  = async () => {
  try{

    dispatch(showLoader());
    const response = await clearUnreadMessages(selectedChat._id);
    dispatch(hideLoader());

    if(response.success){
      allChats.map(chat => {
        if(chat._id === selectedChat._id){
         return response.data;
        }
        return chat;
      })
    }

  }catch(error){
    dispatch(hideLoader());
    toast.error(error.message);
  }
}

function formatName(user) {
  let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
  let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
  return fname + " " + lname;
}

useEffect(() => {
  if(selectedChat){
    getMessages();
    clearUnreadMessage();
  }
}, [selectedChat]);


  return (
    <div className="app-chat-area">

      <div className="app-chat-area-header">
        {formatName(selectedUser)}
        
      </div>

     
<div className="main-chat-area">
  {allMessages.map((msg, index) => {
     console.log(msg);
    const isCurrentUserSender = msg.sender === user._id;

    return (
      <div
            key={index}
            className="message-container"
            style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
            <div>
              <div className={isCurrentUserSender ? "send-message" : "received-message"}> {msg.text} </div>
              <div className="message-timestamp" style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>{formateTime(msg.createdAt)}</div>
            </div>
          </div>
        );
      })}
    </div>
      

      <div className="send-message-div">
        <input
          type="text"
          className="send-message-input"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          className="fa fa-paper-plane send-message-btn"
          onClick={sendMessage}
        ></button>
      </div>

    </div>
  );
}

export default ChatArea;