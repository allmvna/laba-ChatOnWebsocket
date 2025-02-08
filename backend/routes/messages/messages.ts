import {WebSocket} from "ws";
import express from "express";
import expressWs from "express-ws";
import Message from "../../models/Message/Message";
import {authenticateWebSocket} from "../../middleware/auth";

const messageRoute = express.Router();
const app = express();
expressWs(app);

interface AuthWebSocket extends WebSocket {
    username?: string;
}

const connectedClients: AuthWebSocket[] = [];
const connectedUsernames: string[] = [];

interface IncomingMessage {
    type: string;
    payload: string;
}

messageRoute.ws("/", (ws: AuthWebSocket, req) => {
    ws.username = "Anonymous";
    connectedClients.push(ws);

    console.log("Client connected. Total clients:", connectedClients.length);

    const sendLastMessages = async () => {
        try{
            const messages = await Message.find().sort({ createdAt: -1 }).limit(30);
            const formattedMessages = messages.map(msg => ({
                username: msg.username,
                text: msg.text,
                createdAt: msg.createdAt.toISOString(),
            }));
            ws.send(JSON.stringify({
                type: "LAST_MESSAGES",
                payload: formattedMessages
            }));
        } catch (e) {
            console.error("Error fetching last messages:", e);
            ws.send(JSON.stringify({ error: "Failed to fetch last messages" }));
        }
    };

    const sendConnectedUsers = () => {
        try{
            connectedClients.forEach(client => {
               if (client.send) {
                   client.send(JSON.stringify({
                       type: "CONNECTED_USERS",
                       payload: connectedUsernames
                   }));
               }
            });
        } catch (e) {
            console.error("Error sending connected users:", e);
        }
    };

    ws.on("message", async (message) => {
        try {
            const decodedMessage = JSON.parse(message.toString()) as IncomingMessage;

            if (!["LOGIN", "SEND_MESSAGE"].includes(decodedMessage.type)) {
                ws.send(JSON.stringify({ error: "Unknown message type" }));
                return;
            }

            if (decodedMessage.type === "LOGIN") {
                const token = decodedMessage.payload;
                const user = await authenticateWebSocket(token);

                if (user) {
                    if (connectedUsernames.includes(user.username)) {
                        ws.send(JSON.stringify({ error: "Username already taken" }));
                        ws.close();
                        return;
                    }

                    ws.username = user.username;
                    console.log(`${ws.username} connected`);
                    connectedUsernames.push(ws.username);
                    sendConnectedUsers();
                    await sendLastMessages();
                } else {
                    ws.send(JSON.stringify({ error: "Invalid token" }));
                    ws.close();
                    return;
                }
            }

            if (decodedMessage.type === "SEND_MESSAGE") {
                if (!ws.username || ws.username === "Anonymous") {
                    ws.send(JSON.stringify({ error: "You must log in before sending messages." }));
                    return;
                }

                const msg = new Message({ username: ws.username, text: decodedMessage.payload });

                await msg.save();

                connectedClients.forEach(client => {
                    if (client.send) {
                        client.send(JSON.stringify({
                            type: "NEW_MESSAGE",
                            payload: {
                                username: ws.username,
                                text: decodedMessage.payload,
                                createdAt: msg.createdAt.toISOString(),
                            }
                        }));
                    }
                });
            }
        } catch (e) {
            console.error("Error processing message:", e);
            ws.send(JSON.stringify({ error: "Invalid message format" }));
        }
    });

    ws.on("close", () => {
        console.log(`${ws.username || "Anonymous"} disconnected`);
        const index = connectedClients.indexOf(ws);
        if (index !== -1) {
            connectedClients.splice(index, 1);
            if (ws.username) {
                const usernameIndex = connectedUsernames.indexOf(ws.username!);
                if (usernameIndex !== -1) {
                    connectedUsernames.splice(usernameIndex, 1);
                    sendConnectedUsers();
                }
            }
        }
        console.log("Total clients:", connectedClients.length);
    });
});

export default messageRoute;
