import User from "../models/User/User";

export const authenticateWebSocket = async (token: string) => {
    return User.findOne({token});
};

