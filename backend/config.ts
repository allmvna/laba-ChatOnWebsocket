import path from "path";

const pathName = __dirname;

const config = {
    pathName,
    publicPath: path.join(pathName, 'public'),
    google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        secretId: process.env.GOOGLE_SECRET_ID,
    },
    db: 'mongodb://localhost/chat',
};

export default config;


