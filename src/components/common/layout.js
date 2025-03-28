import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Header from './header';
import Footer from './footer';
import { useAuth } from "../context/AuthContext";
import CustomerChat from "../chatbox/CustomerChat";
import Logo1 from "../../assets/chatstaff.jpg";
import Logo2 from "../../assets/close.jpg";
import { io } from 'socket.io-client';

const Layout = () => {
    const { user } = useAuth() || { user: null };
    const [showChat, setShowChat] = useState(false);
    const [notificationCount, setNotificationCount] = useState(0);
    useEffect(() => {
        if (!user?.id) return;

        const socket = io("http://localhost:3000");

        socket.on("connect", () => {
            socket.emit("join", user.id);
        });

        socket.on("getNotification", () => {
            if (!showChat) {
                setNotificationCount(prev => prev + 1);
            }
        });

        return () => {
            socket.disconnect();
        };
    }, [user?.id, showChat]);
    useEffect(() => {
        if (!user || !user.id) {
            setShowChat(false);
            setNotificationCount(0);
        }
    }, [user]);
    const handleToggleChat = () => {
        setShowChat(!showChat);
        if (!showChat) {
            setNotificationCount(0);
        }
    };
    return (
        <>
            <Header />
            <div style={{ minHeight: '42vh' }}>
                <Outlet></Outlet>
                {Object.keys(user).length !== 0 && (
                    <button
                        onClick={handleToggleChat}
                        style={{
                            position: "fixed",
                            bottom: "20px",
                            marginBottom: "60px",
                            right: "20px",
                            width: "60px",
                            height: "60px",
                            border: "none",
                            borderRadius: "50%",
                            cursor: "pointer",
                            zIndex: 1000,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            padding: "0",
                            backgroundColor: 'white'
                        }}
                    >
                        {showChat ? (
                            <img
                                src={Logo2}
                                alt="Close Chat"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                }}
                            />
                        ) : (
                            <img
                                src={Logo1}
                                alt="Chat with Staff"
                                style={{
                                    width: "40px",
                                    height: "40px",
                                }}
                            />
                        )}
                        {!showChat && notificationCount > 0 && (
                            <span style={{
                                position: "absolute",
                                top: "-5px",
                                right: "-5px",
                                width: "20px",
                                height: "20px",
                                backgroundColor: "red",
                                borderRadius: "50%",
                                color: "white",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: "12px",
                            }}>
                                {notificationCount}
                            </span>
                        )}
                    </button>
                )}

                {showChat && <CustomerChat userId={user.id} />}
            </div>
            <Footer />
        </>
    );
};

export default Layout;