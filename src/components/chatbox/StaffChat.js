import { Button } from "antd";
import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import { readNotification } from "../../services/chat.service";

const StaffChat = ({ userId, onResetNotifications, notifications, setNotifications }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [userChatList, setUserChatList] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3000");

        socketRef.current.emit("join", userId);

        socketRef.current.on("userChatList", (users) => {
            setUserChatList(users);
        });

        socketRef.current.on("loadMessages", (loadedMessages) => {
            setMessages(loadedMessages);
        });

        socketRef.current.on("receiveMessage", (data) => {
            setMessages((prevMessages) => [...prevMessages, data]);
        });

        socketRef.current.on("newMessageNotification", ({ senderId, message }) => {
            if (senderId !== selectedUser) {
                setNotifications((prev) => [...prev, { senderName: message.sender_id.username, senderId }]);
            }
        });

        // Remove the getNotification listener since it's handled in Dashboard
        // socketRef.current.on("getNotification", (data) => {
        //     if (!selectedUser || data.senderId !== selectedUser) {
        //         setNotifications((prev) => [...prev, { senderName: data.senderName, senderId: data.senderId }]);
        //     }
        // });

        return () => {
            socketRef.current.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() === "" || !selectedUser) return;

        const messageData = {
            sender_id: userId,
            message: input,
            recipient_id: selectedUser,
        };

        socketRef.current.emit("sendMessage", messageData);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSendMessage();
        }
    };

    const handleSelectUser = (senderId) => {
        setSelectedUser(senderId);
        readNotification(userId, senderId, setNotifications); // userId is staff, senderId is customer
        socketRef.current.emit("loadUserMessages", senderId);
        setOpen(false);
        if (onResetNotifications) {
            onResetNotifications();
        }
    };

    // const handleRead = () => {
    //     setNotifications([]);
    //     setOpen(false);
    //     if (onResetNotifications) {
    //         onResetNotifications();
    //     }
    // };

    const displayNotification = ({ senderName }) => {
        return (
            <div style={{ padding: "5px" }}>
                New message from {senderName}
            </div>
        );
    };

    return (
        <div style={{
            width: "600px",
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            display: "flex",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            marginRight: '80px',
        }}>
            <div style={{
                width: "200px",
                borderRight: "1px solid #ccc",
                overflowY: "auto",
                backgroundColor: "#fff",
            }}>
                <div style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px",
                    textAlign: "center",
                    borderTopLeftRadius: "10px",
                    position: "relative",
                }}>
                    <h3 style={{ margin: 0 }}>Customer</h3>
                    {notifications.length > 0 && (
                        <div style={{
                            position: "absolute",
                            right: "10px",
                            top: "10px",
                            width: "20px",
                            height: "20px",
                            backgroundColor: "red",
                            borderRadius: "50%",
                            color: "white",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                        }} onClick={() => setOpen(!open)}>
                            {notifications.length}
                        </div>
                    )}
                    {open && (
                        <div style={{
                            position: "absolute",
                            top: "40px",
                            right: "10px",
                            backgroundColor: "white",
                            border: "1px solid #ccc",
                            borderRadius: "5px",
                            padding: "10px",
                            zIndex: 1000,
                        }}>
                            {notifications.map((n, index) => (
                                <div key={index}>{displayNotification(n)}</div>
                            ))}
                        </div>
                    )}
                </div>
                {userChatList.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => handleSelectUser(user._id)}
                        style={{
                            padding: "10px",
                            cursor: "pointer",
                            backgroundColor: selectedUser === user._id ? "#e9ecef" : "transparent",
                            borderBottom: "1px solid #eee",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                        {user.username}
                        {notifications.some(n => n.senderId === user._id) && (
                            <span style={{
                                width: "10px",
                                height: "10px",
                                backgroundColor: "red",
                                borderRadius: "50%",
                                display: "inline-block",
                            }} />
                        )}
                    </div>
                ))}
            </div>

            <div style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
            }}>
                <div style={{
                    backgroundColor: "#007bff",
                    color: "white",
                    padding: "10px",
                    borderTopRightRadius: "10px",
                    textAlign: "center",
                }}>
                    <h3 style={{ margin: 0 }}>
                        {selectedUser
                            ? `Chat với ${userChatList.find((user) => user._id === selectedUser)?.username}`
                            : "Choose Customer"}
                    </h3>
                </div>

                <div style={{
                    flex: 1,
                    padding: "10px",
                    overflowY: "auto",
                    display: "flex",
                    flexDirection: "column",
                    gap: "10px",
                }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            style={{
                                maxWidth: "70%",
                                padding: "8px 12px",
                                borderRadius: "15px",
                                wordWrap: "break-word",
                                alignSelf: message.sender_id._id === userId ? "flex-end" : "flex-start",
                                backgroundColor: message.sender_id._id === userId ? "#007bff" : "#e9ecef",
                                color: message.sender_id._id === userId ? "white" : "black",
                            }}
                        >
                            <div style={{ fontSize: "12px", fontWeight: "bold" }}>
                                {message.sender_id.username}
                            </div>
                            {message.message}
                            <div style={{ fontSize: "10px", opacity: 0.7 }}>
                                {new Date(message.timestamp).toLocaleTimeString()}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                <div style={{
                    display: "flex",
                    padding: "10px",
                    borderTop: "1px solid #ccc",
                    backgroundColor: "white",
                    borderBottomRightRadius: "10px",
                }}>
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        placeholder="Nhập tin nhắn..."
                        style={{
                            flex: 1,
                            padding: "8px",
                            border: "1px solid #ccc",
                            borderRadius: "20px",
                            outline: "none",
                            marginRight: "10px",
                        }}
                        disabled={!selectedUser}
                    />
                    <Button
                        onClick={handleSendMessage}
                        style={{
                            padding: "8px 15px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "20px",
                            cursor: "pointer",
                        }}
                        disabled={!selectedUser}
                    >
                        Send
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default StaffChat;