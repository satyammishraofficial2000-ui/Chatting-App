import Header from "./components/header";
import Sidebar from "./components/sidebar";
import ChatArea from "./components/chat";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";
import { useEffect, useState } from "react";

const socket = io("http://localhost:3000");

function Home() {

     const { selectedChat, user } = useSelector(
          state => state.usersReducer
     );

     const [onlineUsers, setOnlineUsers] = useState([]);
     const [mobileChatOpen, setMobileChatOpen] = useState(false);
     const [reminderText, setReminderText] = useState("");
     

     useEffect(() => {

          if (user) {

               socket.emit('join-room', user._id);
               socket.emit('user-login', user._id);

               console.log(
                    "Joined room:",
                    user._id
               );

               if (
                    Notification.permission !==
                    "granted"
               ) {
                    Notification.requestPermission();
               }

               socket.off('online-users');
               socket.off('online-users-updated');
               socket.off('reminder-notification');

               socket.on(
                    'online-users',
                    onlineusers => {
                         setOnlineUsers(
                              onlineusers
                         );
                    }
               );

               socket.on(
                    'online-users-updated',
                    onlineusers => {
                         setOnlineUsers(
                              onlineusers
                         );
                    }
               );

               socket.on(
                    'reminder-notification',
                    data => {
                         const audio = new Audio(
                              "/sounds/notification.mp3"
                         );

                         audio.play();
                        setReminderText(data.text);

                         try {

                              new Notification(
                                   "⏰ QuickChat Reminder",
                                   {
                                        body: data.text
                                   }
                              );

                              console.log(
                                   "Notification Created"
                              );

                         } catch (error) {

                              console.log(
                                   "Notification Error:",
                                   error
                              );

                         }

                    }
               );

          }

          return () => {

               socket.off(
                    'reminder-notification'
               );

          };

     }, [user]);

     return (
          <div className="home-page">

               <Header socket={socket} />
              {reminderText && (
     <div
          style={{
               position: "fixed",
               top: "50%",
               left: "50%",
               transform: "translate(-50%, -50%)",
               background: "#fff",
               padding: "25px",
               borderRadius: "20px",
               boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
               zIndex: 99999,
               width: "320px",
               textAlign: "center"
          }}
     >
          <div
               style={{
                    fontSize: "50px",
                    marginBottom: "10px"
               }}
          >
               ⏰
          </div>

          <h3>Reminder</h3>

          <p>{reminderText}</p>

          <button
               onClick={() =>
                    setReminderText("")
               }
               style={{
                    marginTop: "10px",
                    padding: "10px 20px",
                    border: "none",
                    borderRadius: "10px",
                    cursor: "pointer"
               }}
          >
               Got It
          </button>
     </div>
)}

               <div className="main-content">

                    {(!mobileChatOpen ||
                         window.innerWidth > 768) && (
                         <Sidebar
                              socket={socket}
                              onlineUsers={onlineUsers}
                              setMobileChatOpen={
                                   setMobileChatOpen
                              }
                         />
                    )}

                    {selectedChat &&
                         (mobileChatOpen ||
                              window.innerWidth > 768) && (
                              <ChatArea
                                   socket={socket}
                                   setMobileChatOpen={
                                        setMobileChatOpen
                                   }
                              />
                         )}

               </div>

          </div>
     );
}

export default Home;