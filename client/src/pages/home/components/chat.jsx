import { useSelector,useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages } from "../../../apiCalls/message";
import { useState } from "react";
import { useEffect } from "react";
import moment from "moment";
import {clearUnreadMessages} from "../../../apiCalls/chat";
import { setAllChats } from "../../../redux/usersSlice";
import store from "./../../../redux/store";
import EmojiPicker from "emoji-picker-react";



function ChatArea({ socket }) {

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
  const  [isTyping, setIsTyping] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);




  const sendMessage = async (image) => {
    try{
      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image
      };

       
      socket.emit('send-message',{
        ...newMessage,
       members: selectedChat.members.map(m => m._id ? m._id : m),
        read: false,
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss')
      })

      //dispatch(showLoader());
      const response = await createNewMessage(newMessage);
      //dispatch(hideLoader());

     if(response.success){
      setMessage("");
      setShowEmojiPicker(false);

     setAllMessages(prev => [...prev, {
        ...newMessage,
        read: false,
        createdAt: moment().format('YYYY-MM-DD hh:mm:ss')
      }]);

       /* toast.success(response.message);
        setMessage("");*/

      }
    }catch(error){
      //dispatch(hideLoader());
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

    socket.emit('unread-messages-cleared',{
      chatId: selectedChat._id,
     members: selectedChat.members.map(m => m._id ? m._id : m)
    })
    const response = await clearUnreadMessages(selectedChat._id);
  

    if(response.success){
      getMessages();


      const updatedChats = allChats.map(chat => {
        if(chat._id === selectedChat._id){
          return { ...chat, unreadMessageCount: 0 };
        }
        return chat;
      });

      dispatch(setAllChats(updatedChats));
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

function sendImage(e) {
  const file = e.target.files[0];
  const reader = new FileReader(file);
  reader.readAsDataURL(file);
  reader.onload = async () => {
    sendMessage(reader.result);

  }
}




useEffect(() => {
  getMessages();

  if (selectedChat?.lastMessage?.sender !== user._id) {
    clearUnreadMessage();
  }

  socket.off('receive-message').on("receive-message", (message) => {
    const selectedChat = store.getState().usersReducer.selectedChat;
    if(message.chatId === selectedChat._id){
      setAllMessages((prevmsg) => [...prevmsg, message]);
    }
    if(selectedChat._id === message.chatId && message.sender !== user._id){
      clearUnreadMessage();
    }
  })

socket.on('message-count-cleared', data => {

  const allChats = store.getState().usersReducer.allChats;

  const updatedChats = allChats.map(chat => {
    if(chat._id === data.chatId){
      return { ...chat, unreadMessageCount: 0 };
    }
    return chat;
  });

  dispatch(setAllChats(updatedChats));

  setAllMessages(prevMsg => {
    return prevMsg.map(msg => {
      return { ...msg, read: true };
    });
  });

})

//show some typing indicator in chat area
socket.off('started-typing').on('started-typing', (data) => {

  if(data.chatId === selectedChat._id && data.senderId !== user._id){

    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
    }, 1200);
  }
});
  return () => {
    return () => {
  socket.removeAllListeners("receive-message");
  socket.removeAllListeners("unread-messages-cleared");
};
  };
}, [selectedChat]);

useEffect(() => {
  const msgContainer = document.getElementById('main-chat-area');
  msgContainer.scrollTop = msgContainer.scrollHeight;
},[allMessages]);


  return (
    <div className="app-chat-area">

      <div className="app-chat-area-header">
        {formatName(selectedUser)}
        
      </div>

     
<div className="main-chat-area" id="main-chat-area">
  {allMessages.map((msg, index) => {
    
    const isCurrentUserSender = msg.sender === user._id;

    return (
      <div
            key={index}
            className="message-container"
            style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
            <div>
              <div className={isCurrentUserSender ? "send-message" : "received-message"}> 
                <div>{msg.text} </div>
                <div>
                  {msg.image && <img src={msg.image} alt="image" height="120" width="120" />}
                </div>
                </div>
              <div className="message-timestamp" style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>
                {formateTime(msg.createdAt)} {isCurrentUserSender && msg.read &&  
                <i className="fa fa-check-circle" aria-hidden="true" style={{ color: "#e7c3c" }}></i>
                }
              </div>
            </div>
          </div>
        );
      })}
      <div className="typing-indicator">{isTyping && <i>typing....</i>}</div>
    </div>
      
      
      <div className="send-message-div">
         {
            showEmojiPicker && (
              <div className="emoji-picker-container">
                <EmojiPicker onEmojiClick={(e) =>setMessage (message + e.emoji)}></EmojiPicker>
              </div>
            )
          }
        <input
          type="text"
          className="send-message-input"
          placeholder="Type a message"
          value={message}
          onChange={(e) => {
            setMessage(e.target.value)
            socket.emit('user-typing',{
              chatId: selectedChat._id,
              senderId: user._id,
              members: selectedChat.members.map(m => m._id ? m._id : m)

            })
            
          }
        }
        />
        <label for="file">
          <i className="fa fa-picture-o send-image-btn"></i>
          <input 
            type="file"
            id="file"
            style={{display:'none'}}
            accept="image/jpg,image/png,image/jpeg,image/gif"
            onChange={sendImage}
          />
        </label>
        <button
          className="fa fa-smile-o send-emoji-btn"
          aria-hidden="true"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        ></button>

        <button
          className="fa fa-paper-plane send-message-btn"
          aria-hidden="true"
          onClick={() => sendMessage()}
        ></button>
      </div>

    </div>
  );
}

export default ChatArea;