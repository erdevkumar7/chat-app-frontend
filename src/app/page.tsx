"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";
// const chatButtonStyle: any = {
//   position: "fixed",
//   bottom: "20px",
//   right: "20px",
// };

// const chatContainerStyle: any = {
//   position: "fixed",
//   bottom: "70px",
//   right: "20px",
//   width: "400px",
//   height: "500px",
//   backgroundColor: "#66d9ff",
//   border: "2px solid #ccc",
//   borderRadius: "10px",
//   padding: "10px",
// };

// const messageContainerStyle: any = {
//   maxHeight: "calc(100% - 60px)", // Adjust the height of the message container
//   overflowY: "auto",
// };

const Home = () => {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState<any>("");
  const [showChat, setShowChat] = useState(false);

  const socket = io("http://127.0.0.1:8000/");

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      setMessages([...messages, data]);
    });
    return () => {
      socket.disconnect();
    };
  }, [messages, socket]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      socket.emit("message", input);
      setMessages([...messages, { text: input, isUser: true }]);
      setInput("");
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div>
      <button className="chatButtonStyle" onClick={toggleChat}>
        Chat with Me
      </button>

      {showChat && (
        <div className="chatContainerStyle">

          <div>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
