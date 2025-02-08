import { useEffect, useState } from "react";
import { useAppSelector } from "../../app/hooks.ts";
import { selectUser } from "../features/users/userSlice.ts";

interface Message {
    username: string;
    text: string;
    createdAt: string;
}

const useWebSocket = () => {
    const user = useAppSelector(selectUser);
    const token = user?.token;
    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [messages, setMessages] = useState<Message[]>([]);
    const [connectedUsers, setConnectedUsers] = useState<string[]>([]);

    useEffect(() => {
        if (!token) return;

        const ws = new WebSocket("ws://localhost:8000/messages");

        ws.onopen = () => {
            console.log("Connected to WebSocket");
            ws.send(JSON.stringify({
                type: "LOGIN",
                payload: token
            }));
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
        };

        ws.onclose = () => {
            console.log("Disconnected from WebSocket");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, [token]);

    const sendMessage = (text: string) => {
        if (socket) {
            socket.send(JSON.stringify({
                type: "SEND_MESSAGE",
                payload: text
            }));
        }
    };

    return { messages, sendMessage, connectedUsers };
};

export default useWebSocket;