import express from "express";
import {Error} from 'mongoose';
import User from "../../models/User/User";

const usersRoute = express.Router();

usersRoute.post("/", async (req, res, next) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
        });

        user.generateToken();
        await user.save();
        res.send(user);
    } catch (error){
        if(error instanceof Error.ValidationError){
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});

usersRoute.post('/sessions', async (req, res, next) => {
    try{
        const { username, password } = req.body;
        const user = await User.findOne({ username });

        if (!user) {
            res.status(400).send({error: 'Username not found'});
            return;
        }

        const isMatch = await user.checkPassword(password);

        if (!isMatch) {
            res.status(400).send({error: 'Password is wrong'});
            return;
        }

        user.generateToken();
        await user.save();

        res.send({message: 'Username and password correct!', user});

    } catch (error){
        if(error instanceof Error.ValidationError){
            res.status(400).send(error);
            return;
        }
        next(error);
    }
});


usersRoute.delete('/sessions', async (req, res, next) => {
    try {
        const token = req.get('Authorization');

        const success = {message: 'Success'};

        if (!token) {
            res.send(success);
            return;
        }

        const user = await User.findOne({token});

        if (!user){
            res.send(success)
            return;
        }

        user.generateToken();
        await user.save();
        res.send(success);
        return;
    } catch (e) {
        return next(e);
    }
});


export default usersRoute;