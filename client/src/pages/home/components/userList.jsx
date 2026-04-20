import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader } from "../../../redux/loaderSlice";
import { showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";
import moment from "moment";

function UserList({ searchKey }) {

  const { allusers, allChats, user: currentUser, selectedChat } = useSelector(state => state.usersReducer);
  const dispatch = useDispatch();
 

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
        const updatedChat = [...allChats, newChat];
        dispatch(setAllChats(updatedChat));
        dispatch(setSelectedChat(newChat));
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
    (chat?.members?.map(m => (m._id ? m._id : m)) || [])
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
 
  return (
    <>
      {allusers
        .filter(user => {
          return (
            (
            user.firstname.toLowerCase().includes(searchKey.toLowerCase()) ||
            user.lastname.toLowerCase().includes(searchKey.toLowerCase())) && 
            searchKey
          ) || (allChats.find(chat => (chat?.members?.map(m => (m._id ? m._id : m)) || []).includes(user._id)))
        }) 
        .map((user) => {
          return (
            <div className="user-search-filter" key={user._id}>
              <div className={IsSelectedChat(user) ? "selected-user" : "filtered-user"} onClick={() => openChat(user._id)}>
                <div className="filter-user-display">

                  {user.profilePic && (
                    <img
                      src={user.profilePic}
                      alt="Profile Pic"
                      className="user-profile-image"
                    />
                  )}

                  {!user.profilePic && (
                    <div className={"user-default-avatar"}>
                      {
                        user.firstname.charAt(0).toUpperCase() +
                        user.lastname.charAt(0).toUpperCase()
                      }
                    </div>
                  )}

                  <div className="filter-user-details">
                    <div className="user-display-name"> {user.firstname + " " + user.lastname} </div>
                    <div className="user-display-email"> { getlastMessage(user._id) || user.email}</div>
                  </div>
                  <div>
                    {getUnreadMessageCount(user._id)}
                    <div className="last-message-timestamp">{getLastMessageTimestamp(user._id)}</div>
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
    </>
  );
}

export default UserList;