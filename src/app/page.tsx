"use client";
import React, { useState, useEffect } from "react";
import io from "socket.io-client";

const chatButtonStyle: any = {
  position: "fixed",
  bottom: "20px",
  right: "20px",
};

const chatContainerStyle: any = {
  position: "fixed",
  bottom: "70px",
  right: "20px",
  width: "400px",
  height: "500px",
  backgroundColor: "#66d9ff",
  border: "2px solid #ccc",
  borderRadius: "10px",
  padding: "10px",
};

const messageContainerStyle: any = {
  maxHeight: "calc(100% - 60px)", // Adjust the height of the message container
  overflowY: "auto",
};

const Home = () => {
  const [messages, setMessages] = useState<any>([]);
  const [input, setInput] = useState<any>("");
  const [showChat, setShowChat] = useState(false);

  const socket = io("http://127.0.0.1:8000/");

  useEffect(() => {
    // Connect to the Socket.IO server
    socket.on("connect", () => {
      console.log("Connected to server");
    });

    socket.on("message", (data) => {
      // Update messages state with received message
      setMessages([...messages, data]);
    });

    socket.on("first-message",(data)=>{
      console.log(data)
    })

    // Clean up on component unmount
    return () => {
      socket.disconnect();
    };
  }, [messages, socket]);

  const sendMessage = () => {
    if (input.trim() !== "") {
      // Emit 'message' event with user's input
      socket.emit("message", input);
      // Add user's message to the chat interface
      setMessages([...messages, { text: input, isUser: true }]);
      // Clear input field
      setInput("");
    }
  };

  const toggleChat = () => {
    setShowChat(!showChat);
  };

  return (
    <div>
      <button onClick={toggleChat} style={chatButtonStyle}>
        Chat
      </button>

      {showChat && (
        <div style={chatContainerStyle}>
          <div>Chat Interface</div>
          <div style={messageContainerStyle}>
            {/* Render chat messages */}
            {messages.map((message: any, index: any) => (
              <div
                key={index}
                style={{ textAlign: message.isUser ? "right" : "left" }}
              >
                {message.text}
              </div>
            ))}
          </div>
          {/* Input field for user to type messages */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          />
          {/* Button to send message */}
          <div>
            <button onClick={sendMessage}>Send</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
