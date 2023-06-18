import React, { useEffect, useState, useRef, useCallback } from "react";
import { styled } from "@mui/material/styles";
import { Paper, Grid, Container, Stack } from "@mui/material";
import { TextInput } from "./TextInput.js";
import { MessageLeft, MessageRight } from "./Messages.js";
import socket from "../../app/socket.js";
import { useParams } from "react-router-dom";
const StyledPaper = styled(Paper)(({ theme }) => ({
  display: "flex",
  padding: theme.spacing(1),
  paddingBottom: 0,
  margin: 0,
  alignItems: "center",
  flexDirection: "column",
  position: "relative",
  maxHeight: "500px",
  width: "100%",
  height: "55vh",
}));

const MessagesBody = styled("div")(({ theme }) => ({
  width: "100%",
  height: "100%",
  overflowY: "scroll",
  flex: "1",
}));

export default function ChatBox() {
  const { roomId } = useParams();

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesBodyRef = useRef(null);
  const scrollToBottom = () => {
    if (messagesBodyRef.current) {
      messagesBodyRef.current.scrollTop = messagesBodyRef.current.scrollHeight;
    }
  };
  const handleInputChange = useCallback((e) => {
    setMessage(e.target.value);
  }, []);

  const sendMessage = () => {
    socket.emit("send_message", {
      message,
      roomId: parseInt(roomId),
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    sendMessage();
    setMessage("");
  };

  useEffect(() => {
    socket.on("message_sent", (data) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    scrollToBottom();

    return () => {
      socket.off("message_sent");
    };
  }, [messages]);

  return (
    <StyledPaper elevation={2}>
      <MessagesBody ref={messagesBodyRef}>
        {messages.map((msg, index) =>
          msg.sender === socket.id ? (
            <MessageRight
              key={index}
              message={msg.message}
              photoURL={msg.photoURL}
              displayName={msg.displayName}
              avatarDisp={true}
            />
          ) : (
            <MessageLeft
              key={index}
              message={msg.message}
              photoURL={msg.photoURL}
              displayName={msg.displayName}
              avatarDisp={false}
            />
          )
        )}
      </MessagesBody>
      <TextInput
        handleFormSubmit={handleFormSubmit}
        handleInputChange={handleInputChange}
        message={message}
      />
    </StyledPaper>
  );
}
