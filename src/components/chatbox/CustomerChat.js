import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const CustomerChat = ({ userId }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [connectionError, setConnectionError] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [open, setOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const socketRef = useRef(null);

    useEffect(() => {
        socketRef.current = io("http://localhost:3000", {
            reconnection: true,
            reconnectionAttempts: 5,
            reconnectionDelay: 1000,
        });

        socketRef.current.on("connect_error", (error) => {
            console.error("Connection error:", error);
            setConnectionError(true);
        });

        socketRef.current.on("connect", () => {
            console.log("Connected to server with userId:", userId);
            setConnectionError(false);
            socketRef.current.emit("join", userId);
        });

        socketRef.current.on("loadMessages", (loadedMessages) => {
            setMessages(loadedMessages);
        });

        socketRef.current.on("receiveMessage", (data) => {
            if (
                data.sender_id._id === userId ||
                data.recipient_id._id === userId
            ) {
                setMessages((prevMessages) => [...prevMessages, data]);
            }
        });

        socketRef.current.on("getNotification", (data) => {
            setNotifications((prev) => [...prev, data]);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, [userId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = () => {
        if (input.trim() === "") return;

        const messageData = {
            sender_id: userId,
            message: input,
            recipient_id: null,
        };

        socketRef.current.emit("sendMessage", messageData);
        setInput("");
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSendMessage();
    };

    const handleRead = () => {
        setNotifications([]);
        setOpen(false);
    };

    const displayNotification = ({ senderName }) => {
        return (
            <div style={{ padding: "5px" }}>
                New message from {senderName}
            </div>
        );
    };

    return (
        <div style={{
            width: "350px",
            height: "500px",
            border: "1px solid #ccc",
            borderRadius: "20px",
            display: "flex",
            flexDirection: "column",
            backgroundColor: "#f9f9f9",
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.5)",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            marginRight: '80px',
        }}>
            <div style={{
                backgroundColor: "#007bff",
                color: "white",
                padding: "10px",
                borderTopLeftRadius: "10px",
                borderTopRightRadius: "10px",
                textAlign: "center",
                position: "relative",
            }}>
                <h3 style={{ margin: 0 }}>Chat với Nhân viên</h3>
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
                        <button onClick={handleRead} style={{
                            marginTop: "10px",
                            padding: "5px 10px",
                            backgroundColor: "#007bff",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                        }}>
                            Mark as read
                        </button>
                    </div>
                )}
            </div>

            {connectionError && (
                <div style={{
                    padding: "10px",
                    backgroundColor: "#ff4d4f",
                    color: "white",
                    textAlign: "center",
                }}>
                    Không thể kết nối với server. Vui lòng thử lại sau.
                </div>
            )}

            <div style={{
                flex: 1,
                padding: "10px",
                overflowY: "auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
            }}>
                {messages.map((message, index) => (
                    <div key={index} style={{
                        maxWidth: "70%",
                        padding: "8px 12px",
                        borderRadius: "15px",
                        wordWrap: "break-word",
                        alignSelf: message.sender_id._id === userId ? "flex-end" : "flex-start",
                        backgroundColor: message.sender_id._id === userId ? "#007bff" : "#e9ecef",
                        color: message.sender_id._id === userId ? "white" : "black",
                    }}>
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
                borderBottomLeftRadius: "10px",
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
                    disabled={connectionError}
                />
                <button
                    onClick={handleSendMessage}
                    style={{
                        padding: "8px 15px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: "20px",
                        cursor: "pointer",
                    }}
                    disabled={connectionError}
                >
                    Gửi
                </button>
            </div>
        </div>
    );
};

export default CustomerChat;




