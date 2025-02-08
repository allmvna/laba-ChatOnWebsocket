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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Message = mongoose.model<MessageFields>("Message", messageSchema);

export default Message;