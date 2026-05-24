import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader } from "../../../redux/loaderSlice";
import { showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import moment from "moment";
import { all } from "axios";
import { useEffect, useState } from "react";
import store from "../../../redux/store";
import { deleteChatForMe } from "../../../apiCalls/chat";


function UserList({ searchKey, socket, onlineUsers, setMobileChatOpen}) {

  const { allusers, allChats, user: currentUser, selectedChat } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();
  const [openChatMenuId, setOpenChatMenuId] = useState(null);
  const [deleteChatId, setDeleteChatId] = useState(null);
 

  //new chat
  const startNewChat = async (searchedUserId) => {
    let response = null;
    try{
      dispatch(showLoader());
      response = await createNewChat([currentUser._id, searchedUserId]);
      dispatch(hideLoader());

      if(response.success){
        toast.success(response.message);
        const newChat = response.data;
        const updatedChat = [newChat, ...allChats];;
        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
        if(window.innerWidth <= 768){
          setMobileChatOpen(true)
        }
      }
    }catch(error){
      toast.error(response?.message);
      dispatch(hideLoader());
    }
   }

  const openChat = (selectedUserId) => {
  const chat = allChats.find(chat =>
    (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(currentUser._id) &&
    (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(selectedUserId)
  );
  
        if (chat) {
      dispatch(setSelectedChat(chat));
      if(window.innerWidth <= 768){
        setMobileChatOpen(true)
      }
    }
};


const IsSelectedChat = (user) => {
  if (selectedChat) {
    return (selectedChat?.members?.map(m => (m._id ? m._id : m)) || []).includes(user._id);
  }
  return false;
};

const getLastMessageTimestamp = (userId) => {
  const chat = allChats.find(chat =>
    (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(userId)
  );

  if (!chat || !chat.lastMessage) {
    return "";
  } else {
    return moment(chat.lastMessage.createdAt).format("hh:mm A");
  }
};

const getlastMessage = (userId) => {
  const chat = allChats.find(chat =>
    (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(userId)
  );

  if (!chat || !chat.lastMessage) {
    return "";
  } else {
    const msgPrefix =
      (chat.lastMessage?.sender?._id || chat.lastMessage?.sender)?.toString() ===
      currentUser._id?.toString()
        ? "You: "
        : "";

    return msgPrefix + (chat.lastMessage?.text?.substring(0, 25) || "");
  }
};

function formatName(user) {
  let fname = user.firstname.at(0).toUpperCase() + user.firstname.slice(1).toLowerCase();
  let lname = user.lastname.at(0).toUpperCase() + user.lastname.slice(1).toLowerCase();
  return fname + " " + lname;
}

useEffect(() => {
  socket.on('receive-message', (message) => {
    const currentSelectedChat = store.getState().usersReducer.selectedChat;
    let allChats = store.getState().usersReducer.allChats;

    if(!currentSelectedChat || currentSelectedChat._id !== message.chatId){
      const updatedChats = allChats.map(chat => {
        if(chat._id === message.chatId){
          return { 
            ...chat, 
            unreadMessageCount: (chat.unreadMessageCount || 0) + 1,
            lastMessage: message
          };
        }
        return chat;
      });
      allChats = updatedChats;
    }
    //1.find the latest chat data from store
    const latesrChat = allChats.find(chat => chat._id === message.chatId);
    //2.update the latest chat with new message data and increment unread count
    const otherChats = allChats.filter(chat => chat._id !== message.chatId);
    //3.create an new array latest chat on the top and other chats down
    allChats = [latesrChat, ...otherChats];
    dispatch(setAllChats(allChats));
    
  });
}, []);

const getUnreadMessageCount = (userId) => {
  const chat = allChats.find(chat =>
    (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(userId)
  );

  const senderId = chat?.lastMessage?.sender?._id || chat?.lastMessage?.sender;

  if (
    chat &&
    chat.unreadMessageCount &&
    senderId?.toString() !== currentUser._id?.toString()
  ) {
    return <div className="unread-message-counter"> {chat.unreadMessageCount} </div>;
  } else {
    return "";
  }
};

function getData() {
  if (searchKey === "") {
    return allChats;
  } else {
    return allusers.filter(user =>
      (user.firstname && user.firstname.toLowerCase().includes(searchKey.toLowerCase())) ||
      (user.lastname && user.lastname.toLowerCase().includes(searchKey.toLowerCase()))
    );
  }
};

 
  return (
    <>
      {getData()
        .map((obj) => {
          let user = obj;
          if(obj.members){
            user = obj.members.find(
              mem => (mem._id ? mem._id : mem) !== currentUser._id
            );
          }
        if(!user){
          return null;
        }
          
          if(!user) return null;
          return (
            <div className="user-search-filter" key={user._id}>
              <div className={IsSelectedChat(user) ? "selected-user" : "filtered-user"} onClick={() => openChat(user._id)}>
                <div className="filter-user-display">

                  {user?.profilePic && (
                    <img
                      src={user.profilePic}
                      alt="Profile Pic"
                      className="user-profile-image"
                      style={onlineUsers?.some(onlineUser => onlineUser.userId === user._id || onlineUser === user._id)? {border: '#03f26b 3px solid'} : {}}
                    />
                  )}

                  {!user?.profilePic && (
                    <div className={"user-default-avatar"}
                    style={onlineUsers?.some(onlineUser => onlineUser.userId === user._id || onlineUser === user._id)? {border: 'green 3px solid'} : {}}
                    >
                      {
                         (user?.firstname?.charAt(0) || "") +
                          (user?.lastname?.charAt(0) || "")
                      }
                    </div>
                  )}

                  <div className="filter-user-details">
                    <div className="user-display-name"> {(user?.firstname || "") + " " + (user?.lastname || "")} </div>
                    <div className="user-display-email"> { getlastMessage(user?._id) || user?.email}</div>
                  </div>

                  <div className="user-chat-actions">
                    {getUnreadMessageCount(user._id)}
                    <div className="last-message-timestamp">
                      {getLastMessageTimestamp(user._id)}
                    </div>
                    {
                      allChats.find(chat =>
                        (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(user._id)
                      ) && (
                        <div className="chat-options">
                          <i
                            className="fa fa-ellipsis-v"
                            onClick={(e) => {
                              e.stopPropagation();
                              if(openChatMenuId === user._id){
                                setOpenChatMenuId(null);
                              } else {
                                setOpenChatMenuId(user._id);
                              }
                            }}
                          ></i>
                          {
                            openChatMenuId === user._id && (
                              <div className="chat-dropdown">
                                <div
                                  className="chat-dropdown-delete"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    const chatToDelete = allChats.find(chat =>
                                      (chat?.members?.map(
                                        m => (m._id ? m._id : m)
                                      ) || []).includes(user._id)
                                    );
                                    setDeleteChatId(chatToDelete._id);
                                  }}
                                                                    
                                >
                                  Delete Chat
                                </div>
                              </div>
                            )
                          }
                        </div>
                      )
                    }
                  </div>

                  { !allChats.find(chat => (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(user._id)) &&
                
                    <div className="user-start-chat">
                      <button className="user-start-chat-btn" onClick={() => startNewChat(user._id)}>
                        Start Chat
                      </button>
                    </div>
                  }

                </div>
              </div>
            </div>
          );
        })}

        {
          deleteChatId && (
            <div className="delete-chat-modal">
              <div className="delete-chat-box">
                <h3>Delete Chat?</h3>
                <p>
                  Are you sure you want to delete this user?
                </p>
                <div className="delete-chat-buttons">
                  <button
                    className="cancel-delete-btn"
                  onClick={() => {
                    setDeleteChatId(null);
                    setOpenChatMenuId(null);
                  }}
                  >
                    Cancel
                  </button>
                  <button
                    className="confirm-delete-btn"
                    onClick={async () => {
                      const response = await deleteChatForMe(
                        deleteChatId
                      );
                      if(response.success){
                        toast.success("Chat deleted");
                        setOpenChatMenuId(null);
                        window.location.reload();
                      } else {
                        toast.error(response.message);
                      }
                      setDeleteChatId(null);
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )
        }
    </>
  );
}

export default UserList;