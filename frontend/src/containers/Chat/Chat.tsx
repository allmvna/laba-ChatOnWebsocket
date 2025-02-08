import React, { useState, useRef } from "react";
import useWebSocket from "../../hooks/useWebSocket";
import {
    Alert,
    Box,
    Container,
    IconButton,
    List,
    ListItem,
    ListItemText,
    Paper,
    TextField,
    Typography
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import dayjs from "dayjs";


const Chat = () => {
    const { messages, sendMessage, connectedUsers } = useWebSocket();
    const [newMessage, setNewMessage] = useState("");
    const userColors = useRef<{ [key: string]: string }>({});

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        if (newMessage.trim()) {
            sendMessage(newMessage.trim());
            setNewMessage("");
        }
    };

    const generateColor = () => {
        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    return (
        <Container>
            <Box sx={{ display: "flex", gap: 3, mt: 3 }}>
                <Box sx={{ flexGrow: 1 }}>
                    {messages.length > 0 ? (
                        <Box
                            sx={{
                                height: "400px",
                                overflowY: "scroll",
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: 2,
                                mb: 3,
                            }}
                        >
                            {messages.map((msg, index) => {
                                if (!userColors.current[msg.username]) {
                                    userColors.current[msg.username] = generateColor();
                                }

                                return (
                                    <Box key={index} mb={2} sx={{ display: "flex", alignItems: "center" }}>
                                        <Typography
                                            variant="body2"
                                            fontWeight="bold"
                                            sx={{
                                                marginRight: 1,
                                                textDecoration: "underline",
                                                color: userColors.current[msg.username],
                                            }}
                                        >
                                            {msg.username}:
                                        </Typography>
                                        <Typography variant="body2">{msg.text}</Typography>
                                        {msg.createdAt && (
                                            <Typography variant="caption" sx={{ ml: 1, color: "text.secondary" }}>
                                                {dayjs(msg.createdAt).format("HH:mm")}
                                            </Typography>
                                        )}
                                    </Box>
                                );
                            })}
                        </Box>
                    ) : (
                        <Alert severity="info" sx={{ mb: 2 }}>
                            No messages yet. Try logging in
                        </Alert>
                    )}

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <TextField
                                label="Enter your message"
                                variant="outlined"
                                fullWidth
                                value={newMessage}
                                onChange={(e) => setNewMessage(e.target.value)}
                                sx={{ flexGrow: 1 }}
                            />
                            <IconButton type="submit" sx={{ ml: 1 }}>
                                <SendIcon fontSize="large" />
                            </IconButton>
                        </Box>
                    </form>
                </Box>


                <Paper sx={{ width: "250px", p: 2 }}>
                    <Typography variant="h6" sx={{ mb: 2 }}>
                        Connected Users
                    </Typography>
                    <List>
                        {connectedUsers.map((user, index) => (
                            <ListItem key={index}>
                                <ListItemText sx={{color: 'blue'}}  primary={user} />
                            </ListItem>
                        ))}
                    </List>
                </Paper>
            </Box>
        </Container>
    );
};

export default Chat;