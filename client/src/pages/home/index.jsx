import Header from "./components/header";
import Sidebar from "./components/sidebar";
import ChatArea from "./components/chat";
import { useSelector } from "react-redux";
import {io} from "socket.io-client";
import { useEffect } from "react";
import { useState } from 'react';

const socket = io('http://localhost:3000');

function Home(){

     const {selectedChat, user} = useSelector(state => state.usersReducer);
     const [onlineUsers, setOnlineUsers] = useState([]);
     const [mobileChatOpen,setMobileChatOpen] = useState(false)
      
     useEffect(() => {
          if(user){
          socket.emit('join-room', user._id);
          socket.emit('user-login', user._id);
          socket.on('online-users', onlineusers => {
               setOnlineUsers(onlineusers);
          })
          socket.on('online-users-updated', onlineusers => {
               setOnlineUsers(onlineusers);
          })
     }
     },[user]);

     return (
          <div className="home-page">
               <Header socket={socket}></Header>
                         <div className="main-content">

                         {(!mobileChatOpen || window.innerWidth > 768) && (
                         <Sidebar
                              socket={socket}
                              onlineUsers={onlineUsers}
                              setMobileChatOpen={setMobileChatOpen}
                         />
                         )}

                         {selectedChat && (mobileChatOpen || window.innerWidth > 768) && (
                         <ChatArea
                              socket={socket}
                              setMobileChatOpen={setMobileChatOpen}
                         />
                         )}

                         </div>
          </div>

     );
}
export default Home;