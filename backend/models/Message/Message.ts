import mongoose, { Schema } from "mongoose";
import {MessageFields} from "../../types";

const messageSchema = new Schema<MessageFields>({
    username: {
        type: String,
        required: true
    },
    text: {
        type: String,
        required: true
    },
});

const Message = mongoose.model<MessageFields>("Message", messageSchema);

export default Message;