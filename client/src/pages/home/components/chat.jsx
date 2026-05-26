import { useSelector,useDispatch } from "react-redux";
import toast from "react-hot-toast";
import { hideLoader, showLoader } from "../../../redux/loaderSlice";
import { createNewMessage, getAllMessages, deleteMessage } from "../../../apiCalls/message";
import React, { useState, useEffect, useMemo } from "react";
import moment from "moment";
import {clearUnreadMessages} from "../../../apiCalls/chat";
import { setAllChats } from "../../../redux/usersSlice";
import store from "./../../../redux/store";
import EmojiPicker from "emoji-picker-react";
import { FaMicrophone } from "react-icons/fa";
import { reactToMessage } from "../../../apiCalls/message";



const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

function ChatArea({ socket,setMobileChatOpen  }) {

  const dispatch = useDispatch();
  const { selectedChat, user, allusers,allChats } = useSelector((state) => state.usersReducer);
  const [message, setMessage] = useState("");
  const [allMessages, setAllMessages] = useState([]);

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
  const recognition = useMemo( () => new SpeechRecognition(),[] );
  const [isListening, setIsListening] = useState(false);
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");
  const [openMenuId, setOpenMenuId] = useState(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [showReactionPicker, setShowReactionPicker] = useState(null);
  const [showActionPopup, setShowActionPopup] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyMessage, setReplyMessage] = useState(null);
  const [popupPosition, setPopupPosition] = useState({
    x: 0,
    y: 0
  });
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchEndX, setTouchEndX] = useState(0);
  const [swipedMessageId, setSwipedMessageId] = useState(null);
  const [showForwardModal, setShowForwardModal] = useState(false);
  const [forwardMessage, setForwardMessage] = useState(null);
  

const isChrome = /Chrome/.test(navigator.userAgent);

  if (!isChrome && !window.voiceToastShown) {
    toast.error("Voice input works best in Google Chrome");
    window.voiceToastShown = true;
  }
  recognition.continuous = false;
  recognition.lang = "en-US";
  recognition.interimResults = false;

      recognition.onresult = (event) => {
      const transcript =
        event.results[event.results.length - 1][0].transcript;
      setLiveTranscript(transcript);
      setMessage(transcript);
  };

  recognition.onstart = () => {
  setIsListening(true);
};

recognition.onend = () => {
  setIsListening(false);
};

recognition.onerror = (event) => {
   console.log(event);
  setIsListening(false);
};



  const sendMessage = async (image) => {
    try{
      
      let scheduleDateTime = null;

      if(scheduledDate && scheduledTime){
        scheduleDateTime = new Date(`${scheduledDate}T${scheduledTime}`);
      }

      const newMessage = {
        chatId: selectedChat._id,
        sender: user._id,
        text: message,
        image: image,
        replyTo: replyMessage
          ? {
              text: replyMessage.text,
              sender: replyMessage.sender
            }
          : null,
        language: user.preferredLanguage || "en",

        isScheduled: scheduleDateTime ? true : false,
        scheduledFor: scheduleDateTime,
        isDelivered: scheduleDateTime ? false : true,
      };

          const tempMessage = {
              ...newMessage,
              _id: Date.now(),
              sending: true,
              createdAt: new Date()
            };

           setAllMessages((prev) => [...prev, tempMessage]);

            setMessage("");
            setReplyMessage(null);
      //dispatch(showLoader());
      console.log(newMessage);
      const response = await createNewMessage(newMessage);
      //dispatch(hideLoader());
      if(response.success && !scheduleDateTime){

          socket.emit('send-message',{
            ...response.data,
            members: selectedChat.members.map(m => m._id ? m._id : m),
          });
       //setAllMessages(prev => [...prev, response.data]);

       }

     if(response.success){
      setScheduledDate("");
      setScheduledTime("");
      setShowScheduleModal(false);
      setShowEmojiPicker(false);
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


    const response = await getAllMessages(selectedChat._id);


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

const handleDeleteMessage = async (messageId, deleteType) => {
  try {
    const response = await deleteMessage({
      messageId,
      deleteType
    });
    if(response.success){
      socket.emit('message-deleted', {
        messageId,
        chatId: selectedChat._id,
        members: selectedChat.members.map(
          m => m._id ? m._id : m
        )
      });
      setAllMessages(prev =>
        prev.filter(msg => msg._id !== messageId)
      );
      //toast.success(response.message);
    }
  } catch(error){
    toast.error(error.message);
  }
};

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

  socket.off('receive-message').on("receive-message", async (message) => {

    const selectedChat = store.getState().usersReducer.selectedChat;

    // Update unread counts for all chats
   const currentChats = store.getState().usersReducer.allChats;

const updatedChats = currentChats.map(chat => {

  if(String(chat._id) === String(message.chatId)){

    return {
      ...chat,
      lastMessage: message,
      unreadMessageCount:
        String(selectedChat._id) === String(message.chatId)
          ? 0
          : (chat.unreadMessageCount || 0) + 1
    };
  }

  return chat;
});

dispatch(setAllChats(updatedChats));


    // Update messages only for opened chat
    if(String(message.chatId) === String(selectedChat._id)){

      setAllMessages((prevmsg) => {

        const filteredMessages = prevmsg.filter(
          msg =>
            !(
              msg.isScheduled &&
              !msg.isDelivered &&
              msg.text === message.text &&
              msg.sender === message.sender
            )
        );
          const exists = filteredMessages.some(
            msg => String(msg._id) === String(message._id)
          );

          if(exists){
            return filteredMessages;
          }

          return [...filteredMessages, message];
                });

    }

    // Clear unread if receiver is inside same chat
    if(
      String(selectedChat._id) === String(message.chatId) &&
      message.sender !== user._id
    ){
      clearUnreadMessage();
    }

  });

  socket.on('message-count-cleared', data => {

    const allChats = store.getState().usersReducer.allChats;

    const updatedChats = allChats.map(chat => {

      if(String(chat._id) === String(data.chatId)){
        return { ...chat, unreadMessageCount: 0 };
      }

      return chat;
    });

    dispatch(setAllChats(updatedChats));

    // Update ticks
    setAllMessages(prevMsg => {

      return prevMsg.map(msg => {

        if(
          msg.sender === user._id &&
          String(msg.chatId) === String(data.chatId)
        ){
          return { ...msg, read: true };
        }

        return msg;
      });
    });

  });

  // typing indicator
  socket.off('started-typing').on('started-typing', (data) => {

    if(
      String(data.chatId) === String(selectedChat._id) &&
      data.senderId !== user._id
    ){

      setIsTyping(true);

      setTimeout(() => {
        setIsTyping(false);
      }, 1200);
    }
  });

  // Listen for message deletion
socket.on('message-deleted', (data) => {
  setAllMessages(prev =>
    prev.filter(msg => msg._id !== data.messageId)
  );
});

// Listen for message reaction updates
socket.on('message-reaction-updated', (data) => {

  setAllMessages(prevMsg => {

    return prevMsg.map(msg => {

      if(msg._id === data.messageId){

        return {
          ...msg,
          reaction: data.reaction
        };

      }

      return msg;

    });

  });

});

return () => {
  socket.off("receive-message");
  socket.off("unread-messages-cleared");
  socket.off("message-count-cleared");
  socket.off("started-typing");
  socket.off("message-deleted");
};

}, [selectedChat]);

useEffect(() => {
  const msgContainer = document.getElementById('main-chat-area');
  if(msgContainer){
    requestAnimationFrame(() => {
      msgContainer.scrollTop = msgContainer.scrollHeight;
    });
  }
}, [allMessages]);



// Prevent crash when page loads
  if (!selectedChat) {
    return <div className="app-chat-area"></div>;
  }

  // Add reaction to message
const addReaction = async (messageId, emoji) => {
    const currentMessage = allMessages.find(
        msg => msg._id === messageId
    );
    const finalReaction =
        currentMessage?.reaction === emoji
            ? ""
            : emoji;
    const response = await reactToMessage({
        messageId,
        reaction: finalReaction
    });
    if(response.success){
        const updatedMessages = allMessages.map((msg) => {
            if(msg._id === messageId){
                return {
                    ...msg,
                    reaction: finalReaction
                };
            }
            return msg;
        });
        setAllMessages(updatedMessages);
        socket.emit('message-reacted', {
            members: selectedChat.members.map(
                m => m._id ? m._id : m
            ),

            messageId,

            reaction: finalReaction

        });

    }

};

  return (
    <div className="app-chat-area">

        
        <div
          className="app-chat-area-header"
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >

          <i
            className="fa fa-arrow-left mobile-back-btn"
            onClick={() => setMobileChatOpen(false)}
          ></i>

          <div>
            {
              isTyping && (
                <span
                  style={{
                    color: "#22C55E",
                    fontSize: "14px",
                    fontStyle: "italic",
                    fontWeight: "500"
                  }}
                >
                  typing...
                </span>
              )
            }
          </div>

          <div>
            {formatName(selectedUser)}
          </div>

        </div>
     
<div className="main-chat-area" id="main-chat-area"   onClick={() => {
              setShowActionPopup(false);
              setReplyMessage(null);
            }}>
  {allMessages.map((msg, index) => {
    
    const isCurrentUserSender = msg.sender === user._id;

    return (
      <div
            key={msg._id}
            className="message-container"
            style={isCurrentUserSender ? { justifyContent: "end" } : { justifyContent: "start" }}>
            <div>
             <div
                className={`${ isCurrentUserSender ? "send-message" : "received-message"} ${ swipedMessageId === msg._id ? isCurrentUserSender
                        ? "swipe-left"
                          : "swipe-right"
                          : ""
                         }`}
                  onClick={(e) => {
                    if(window.innerWidth < 768){
                      return;
                    }
                     e.stopPropagation();
                    setSelectedMessage(msg);
                    setShowActionPopup(true);
                  }}
                  onTouchStart={(e) => {
                    setTouchStartX(e.changedTouches[0].screenX);
                  }}
                 
                  onTouchEnd={(e) => {

                    const endX = e.changedTouches[0].screenX;

                    setTouchEndX(endX);

                    const swipeDistance = touchStartX - endX;

                    // Sender → swipe left
                    if(isCurrentUserSender && swipeDistance > 70){

                      setSwipedMessageId(msg._id);

                      setSelectedMessage(msg);

                      setShowActionPopup(true);

                      setTimeout(() => {

                        setSwipedMessageId(null);

                      }, 180);

                    }

                    // Receiver → swipe right
                    if(!isCurrentUserSender && swipeDistance < -70){

                      setSwipedMessageId(msg._id);

                      setSelectedMessage(msg);

                      setShowActionPopup(true);

                      setTimeout(() => {

                        setSwipedMessageId(null);

                      }, 180);

                    }

                  }}
                    
              >
                {
                  showReactionPicker === msg._id && (

                    <div className="reaction-picker">

                      {
                        ["👍", "❤️", "😂", "😮", "😢", "🙏"].map((emoji) => (

                          <span
                            key={emoji}
                            className="reaction-emoji"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowReactionPicker(null);
                              setShowActionPopup(false);
                              addReaction(msg._id, emoji);
                            }}
                          >
                            {emoji}
                          </span>

                        ))
                      }

                    </div>

                  )
                }

                {  msg.reaction && (

                          <div className="message-reaction">
                              {msg.reaction}
                          </div>
                      )
                  }

              <div className="message-content">
                  {msg.replyTo?.text && (
                    <div className="chat-reply-box">
                      <div className="chat-reply-line"></div>
                      <div className="chat-reply-content">
                        <div className="chat-reply-title">
                          {msg.replyTo.sender === user._id
                            ? "You"
                            : formatName(selectedUser)
                          }
                        </div>
                        <div className="chat-reply-text">
                          {msg.replyTo.text}
                        </div>
                      </div>
                    </div>
                  )}

                <div>
                  {
                   msg.sender === user._id ||
                    msg.language === user.preferredLanguage
                      ? msg.text
                      : msg.translatedText || msg.text
                  }
                </div>

                <div className="message-menu">

                  <i
                    className="fa fa-ellipsis-v"
                    style={{
                      fontSize: "30px",
                      padding: "5px",
                      cursor: "pointer"
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      if(openMenuId === msg._id){
                        setOpenMenuId(null);
                      } else {
                        setOpenMenuId(msg._id);
                      }
                    }}
                  ></i>
                    {
                  openMenuId === msg._id && (

                  <div
                    className="message-dropdown"
                    style={{
                      marginTop: "12px"
                    }}
                  >
                    <div
                      className="message-dropdown-item"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteMessage(
                              msg._id,
                              isCurrentUserSender ? "everyone" : "me"
                            );
                            setOpenMenuId(null);
                          }}
                    >
                      {
                        isCurrentUserSender
                          ? "Delete for everyone"
                          : "Delete for me"
                      }
                    </div>

                  </div>
                  )
                }

                </div>
              </div>
                
                {msg.isScheduled && !msg.isDelivered && (
                  <div className="scheduled-message-label">
                    ⏰ Scheduled • {formateTime(msg.scheduledFor)}
                  </div>
                )}
                <div>
                  {msg.image && <img src={msg.image} alt="image" height="120" width="120" />}
                </div>
                </div>
            <div className="message-timestamp" style={isCurrentUserSender ? { float: "right" } : { float: "left" }}>
              {formateTime(msg.deliveredAt || msg.createdAt)}

              {isCurrentUserSender && msg.read &&  
                <i
                  className="fa fa-check"
                  aria-hidden="true"
                  style={{ marginLeft: "5px", color: "#2196F3" }}
                ></i>
              }
            </div>
            </div>
          </div>
        );
      })}
    </div>
      
                  {replyMessage && (
              <div className="reply-preview">
                <div className="reply-preview-header">
                  <span>Replying to</span>
                  <button
                    className="close-reply-btn"
                    onClick={() => setReplyMessage(null)}
                  >
                    ✕
                  </button>
                </div>
                <div className="reply-preview-text">
                  {replyMessage.text}
                </div>
              </div>
            )}
      
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
                setMessage(e.target.value);
                clearTimeout(window.typingTimeout);
                window.typingTimeout = setTimeout(() => {
                    socket.emit('user-typing', {
                        chatId: selectedChat._id,
                        senderId: user._id,
                        members: selectedChat.members.map(
                            m => m._id ? m._id : m
                        )
                    });
                }, 300);
            }}

          onKeyDown={(e) => {

              if(e.key === "Enter"){

                  sendMessage();
              }
          }}
        />
        <label htmlFor="file">
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
          className="fa fa-clock-o send-schedule-btn"
          aria-hidden="true"
          onClick={() => setShowScheduleModal(true)}
        ></button>

        <button
          className="fa fa-smile-o send-emoji-btn"
          aria-hidden="true"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        ></button>

        <button className="send-mic-btn"  onClick={() => {
                    if(isListening){
                        recognition.stop();
                        setIsListening(false);
                    }else{
                        recognition.start();
                    }
                }}
            >
          <FaMicrophone />
        </button>

        <button
          className="fa fa-paper-plane send-message-btn"
          aria-hidden="true"
          onClick={() => sendMessage()}
        ></button>
      </div>

        {showScheduleModal && (
        <div className="schedule-modal-overlay">
          <div className="schedule-modal">

            <h3>Schedule Message</h3>

            <input
              type="date"
              value={scheduledDate}
              onChange={(e) => setScheduledDate(e.target.value)}
            />

            <input
              type="time"
              value={scheduledTime}
              onChange={(e) => setScheduledTime(e.target.value)}
            />

            <div className="schedule-modal-buttons">

              <button onClick={() => setShowScheduleModal(false)}>
                Cancel
              </button>

              <button
                onClick={() => {
                  console.log("Scheduled:", scheduledDate, scheduledTime);
                  setShowScheduleModal(false);
                }}
              >
                Schedule
              </button>

            </div>
          </div>
        </div>
      )}

        {isListening && (

            <div className="voice-popup">

              <div className="voice-popup-mic">
                <FaMicrophone />
              </div>

              <div className="voice-popup-text">
                Listening...
              </div>

              <div className="voice-popup-transcript">
                {liveTranscript}
              </div>

            </div>

          )}

      {showActionPopup && selectedMessage && (
        <>

          <div
            className="message-popup-overlay"
            onClick={() => setShowActionPopup(false)}
          ></div>

            <div
              className="message-action-popup"
              onMouseEnter={() => {
                setShowActionPopup(true);
              }}
              onMouseLeave={() => {
                setShowActionPopup(false);
              }}
            >

            <div
              className="popup-item"
                onClick={() => {
                  setReplyMessage(selectedMessage);
                  setShowActionPopup(false);
                }}
            >
              <span>↩</span>
              <span>Reply</span>
            </div>

            <div
              className="popup-item"
              onClick={() => {
                navigator.clipboard.writeText(selectedMessage.text);
                toast.success("Message copied");
                setShowActionPopup(false);
              }}
            >
              <span>📋</span>
              <span>Copy</span>
            </div>

            <div
              className="popup-item"
              onClick={() => {
              setForwardMessage(selectedMessage);
              setShowForwardModal(true);
              setShowActionPopup(false);
                setShowActionPopup(false);
              }}
            >
              <span>📤</span>
              <span>Forward</span>
            </div>
            <div
              className="popup-item"
              onClick={(e) => {
                e.stopPropagation();
                if(showReactionPicker === selectedMessage._id){
                  setShowReactionPicker(null);
                } else {

                  setShowReactionPicker(selectedMessage._id);
                }
                setShowActionPopup(false);
              }}
            >
              <span>😀</span>
              <span>React</span>
            </div>

          </div>

        </>
      )}

      {showForwardModal && (
        <div className="forward-modal-overlay">
          <div className="forward-modal">
            <div className="forward-modal-header">
              <span>Forward Message</span>
              <button
                className="close-forward-btn"
                onClick={() => setShowForwardModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="forward-chat-list">
                            {
                              allChats.map((chat) => {
                                if(String(chat._id) === String(selectedChat._id)){
                                  return null;
                                }
                                const otherMember = chat.members.find(
                                  member =>
                                    String(member._id ? member._id : member) !== String(user._id)
                                );
                                if(!otherMember) return null;
                                return (
                              <div
                                key={chat._id}
                                className="forward-chat-item"
                                onClick={async () => {
                                  const newMessage = {
                                    chatId: chat._id,
                                    sender: user._id,
                                    text: forwardMessage.text,
                                    image: forwardMessage.image || "",
                                    language: user.preferredLanguage || "en",
                                  };
                                  const response = await createNewMessage(newMessage);
                                  if(response.success){
                                    socket.emit('send-message', {
                                      ...response.data,
                                      members: chat.members.map(
                                        m => m._id ? m._id : m
                                      )
                                    });
                                    toast.success("Message forwarded");
                                    setShowForwardModal(false);
                                    setForwardMessage(null);
                                  }
                                }}
                              >
                                    {otherMember.firstname
                                      ? formatName(otherMember)
                                      : "Unknown User"}
                                  </div>
                                );
                              })
                            }
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatArea;