import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { createNewChat } from "../../../apiCalls/chat";
import { hideLoader } from "../../../redux/loaderSlice";
import { showLoader } from "../../../redux/loaderSlice";
import { setAllChats, setSelectedChat } from "../../../redux/usersSlice";

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
       chat.members.map(m => (m._id ? m._id : m)).includes(currentUser._id) && 
       chat.members.map(m => (m._id ? m._id : m)).includes(selectedUserId )
      );
    if (chat) {
      dispatch(setSelectedChat(chat));
    }
  };


const IsSelectedChat = (user) => {
  if (selectedChat) {
    return selectedChat.members
      .map(m => (m._id ? m._id : m))
      .includes(user._id);
  }
  return false;
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
          ) || (allChats.find(chat => chat.members.map(m => (m._id ? m._id : m)).includes(user._id)))
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
                    <div className="user-display-name">
                      {user.firstname + " " + user.lastname}
                    </div>
                    <div className="user-display-email">
                      {user.email}
                    </div>
                  </div>

                  { !allChats.find(chat => chat.members.map(m => (m._id ? m._id : m)).includes(user._id)) &&
                
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