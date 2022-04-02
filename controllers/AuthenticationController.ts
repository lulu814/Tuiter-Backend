/**
 * @file Controller RESTful Web service API for authentication resource
 */
import {Request, Response, Express} from "express";
import UserDao from "../daos/UserDao";
const bcrypt = require('bcrypt');
const saltRounds = 10;


/**
 * Creates singleton controller instance
 * @param app Express instance to declare the RESTful Web service
 * API
 * @constructor
 */
const AuthenticationController = (app: Express) => {

    const userDao: UserDao = UserDao.getInstance();

    /**
     * User login with username and password. Return 403 if credential does not match.
     *
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the user object
     */
    const login = async (req: Request, res: Response) => {
        const user = req.body;
        const username = user.username;
        const password = user.password;
        const existingUser = await userDao
            .findUserByUsername(username);
        const match = await bcrypt.compare(password, existingUser.password);

        if (match) {
            existingUser.password = '*****';
            // @ts-ignore
            req.session['profile'] = existingUser;
            res.json(existingUser);
        } else {
            res.sendStatus(403);
        }
    }

    /**
     * Register new user with username and password. Return 403 if user exists.
     *
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the user object
     */
    const register = async (req: Request, res: Response) => {
        const newUser = req.body;
        const password = newUser.password;
        const hash = await bcrypt.hash(password, saltRounds);
        newUser.password = hash;

        const existingUser = await userDao
            .findUserByUsername(req.body.username);
        if (existingUser) {
            res.sendStatus(403);
            return;
        } else {
            const insertedUser = await userDao
                .createUser(newUser);
            insertedUser.password = '';
            // @ts-ignore
            req.session['profile'] = insertedUser;
            res.json(insertedUser);
        }
    }

    /**
     * Check user profile to see if user has logged in. Return 403 if user didn't log in.
     *
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the user profile object
     */
    const profile = (req: Request, res: Response) => {
        // @ts-ignore
        // The user interface will use the existence of the profile or the error status to
        // conclude whether someone's logged in or not.
        const profile = req.session['profile'];
        if (profile) {
            // safety issue to remove the password information before returning to client
            profile.password = '';
            res.json(profile);
        } else {
            res.sendStatus(403);
        }
    }

    /**
     * Log out user by destroying session.
     *
     * @param {Request} req Represents request from client
     * @param {Response} res Represents response to client, send 200 if succeeded.
     */
    const logout = (req: Request, res: Response) => {
        // @ts-ignore
        req.session.destroy();
        res.sendStatus(200);
    }

    app.post("/api/auth/login", login);
    app.post("/api/auth/register", register);
    app.post("/api/auth/profile", profile);
    app.post("/api/auth/logout", logout);
}

export default AuthenticationController;