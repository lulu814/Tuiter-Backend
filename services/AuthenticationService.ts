/**
 * @file Implements an authentication service. Declares the following methods:
 * <ul>
 *     <li>login</li>
 *     <li>register</li>
 * </ul>
 */
import axios from "axios";
const BASE_URL = process.env.REACT_APP_BASE_URL
const AUTH_API = `${BASE_URL}/api/auth`


import UserDao from "../daos/UserDao"

const userDao: UserDao = UserDao.getInstance();


/**
 * Check if user with the given username and password exists or not
 * @param {string} u Represents username
 * @param {Response} p Represents password
 */
export const login = (u: string, p: string) =>
    userDao.findUserByCredentials(u, p)
        .then(user => {
            if (user) {
                return user;
            } else {
                throw "Unknown user"
            }
        })
        .then(user => user)
        .catch(e => e)

/**
 * Register user with the given username and password if the same username does not exist
 * @param {string} u Represents username
 * @param {Response} p Represents password
 * @param {string} e Represents email
 */
export const register = (u: string, p: string, e: string) =>
    userDao.findUserByUsername(u)
        .then(user => {
            if (user) {
                throw 'User already exists';
            } else {
                return userDao.createUser({
                    username: u, password: p, email: e
                });
            }
        })
        .then(newUser => newUser)
        .catch(e => e);