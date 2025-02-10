import {useCallback, useEffect, useRef, useState} from "react";
import {useAppSelector} from "../../app/hooks.ts";
import {selectUser} from "../features/users/userSlice.ts";

interface Message {
    username: string;
    text: string;
    createdAt: string;
}

const useWebSocket = () => {
    const user = useAppSelector(selectUser);
    const token = user?.token;
    const socketRef = useRef<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);
    const [isConnected, setIsConnected] = useState<boolean>(false);

    const connect = useCallback(() => {
        if (!token) return;

        const ws = new WebSocket("ws://localhost:8000/messages");
        socketRef.current = ws;


        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send(JSON.stringify({
                type: "LOGIN",
                payload: token
            }));
            setIsConnected(true);
        };

        ws.onmessage = (event: MessageEvent) => {
            const data = JSON.parse(event.data);

            if (data.type === "LAST_MESSAGES") {
                setMessages(data.payload);
            } else if (data.type === "NEW_MESSAGE") {
                setMessages((prev) => [...prev, data.payload]);
            } else if (data.type === "CONNECTED_USERS") {
                setConnectedUsers(data.payload);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
            setIsConnected(false);
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
            setIsConnected(false);
            socketRef.current = null;
            setTimeout(connect, 5000);
        };
    },  [token]);

    useEffect(() => {
        if (token) connect();

        return () => {
            socketRef.current?.close();
        };
    }, [token, connect]);

    const sendMessage = useCallback((text: string) => {
        if (socketRef.current?.readyState === WebSocket.OPEN) {
            socketRef.current.send(JSON.stringify({
                type: "SEND_MESSAGE",
                payload: text
            }))
        } else {
            console.warn("WebSocket is not connected, the message has not been sent.");
        }
    }, []);

    return { messages, sendMessage, connectedUsers, isConnected };
};

export default useWebSocket;