import cors from "cors";
import mongoose from "mongoose";
import config from "./config";
import mongoDb from "./mongoDb";
import expressWs from "express-ws";
import express from "express";
import messageRoute from "./routes/messages/messages";
import usersRoute from "./routes/user/user";

const app = express();
expressWs(app);

const port = 8000;
app.use(cors());
app.use(express.json());

app.use('/messages', messageRoute);
app.use('/users', usersRoute);

const run = async () => {
    await mongoose.connect(config.db);

    app.listen(port, () => {
        console.log(`Server started on http://localhost:${port}`);
    });

    process.on('exit', err => {
        mongoDb.disconnect();
    })
};


run().catch(e => console.error(e));
