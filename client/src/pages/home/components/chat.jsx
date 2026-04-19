import { useSelector,useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useState } from "react";
import { useEffect } from "react";



function ChatArea(){

  const dispatch = useDispatch();
  const { selectedChat, user, allusers } = useSelector((state) => state.usersReducer);
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

useEffect(() => {
  if(selectedChat){
    getMessages();
  }
}, [selectedChat]);


  return (
    <div className="app-chat-area">

      <div className="app-chat-area-header">
        {selectedUser ? selectedUser.firstname + " " + selectedUser.lastname : ""}
      </div>

      <div className="main-chat-area">
        CHAT AREA
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