import { useSelector } from "react-redux";

function ChatArea(){

  const { selectedChat, user, allusers } = useSelector((state) => state.usersReducer);

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

  return (
    <div className="app-chat-area">

      <div className="app-chat-area-header">
        {selectedUser ? selectedUser.firstname + " " + selectedUser.lastname : ""}
      </div>

      <div>
        CHAT AREA
      </div>

      <div>
        SEND MESSAGE
      </div>

    </div>
  );
}

export default ChatArea;