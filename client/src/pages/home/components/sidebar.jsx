import Search from "./search";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedChat } from "../../../redux/usersSlice";
import UserList from "./userList";
import { deleteChatForMe } from "../../../apiCalls/chat";

function Sidebar({socket, onlineUsers, setMobileChatOpen}) {
    const [searchKey, setSearchKey] = useState("");
    const [openChatMenuId, setOpenChatMenuId] = useState(null);
    const dispatch = useDispatch();
    const { user,allChats  } = useSelector( state => state.usersReducer);

    return(
        <div className="app-sidebar">
            <Search 
                searchKey={searchKey}
                setSearchKey={setSearchKey}
            />
            <div className="you-chat-card"   onClick={() => {
                    const selfChat = allChats.find(
                        chat => chat.isSelfChat
                    );
                    if(selfChat){
                        dispatch(setSelectedChat(selfChat));
                        if(setMobileChatOpen){
                            setMobileChatOpen(true);
                        }
                    }
                }}>
                <div className="you-chat-icon">
                    📝
                </div>
                <div>
                    <div className="you-chat-title">
                        You
                    </div>
                    <div className="you-chat-subtitle">
                        Save notes, tasks & files
                    </div>
                </div>
            </div>

            <UserList 
                searchKey={searchKey} 
                socket={socket}
                onlineUsers = {onlineUsers}
                setMobileChatOpen={setMobileChatOpen}
            >
            </UserList>
        </div>
    )
}
export default Sidebar;