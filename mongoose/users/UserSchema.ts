/**
 * @file Implements mongoose schema for users
 */

import mongoose from "mongoose";

/**
 * @typedef User Represents the tuit user
 * @property {string} username The user's username, required field
 * @property {string} username The user's password, required field
 * @property {string} firstName The user's firstname
 * @property {string} lastName The user's lasrname
 * @property {string} email The user's email, required field
 * @property {string} profilePhoto The user's profile photo
 * @property {string} headerImage The user's header image
 * @property {string} accountType The user's account type, default is personal
 * @property {string} maritalStatus The user's marital status, default is single
 * @property {string} biography The user's biography
 * @property {date} dateOfBirth The user's birthday
 * @property {date} joined The user's join date, default to current time
 * @property {number[]} location Latitude and Longitude of the location
 */
const UserSchema = new mongoose.Schema({
    username: {type: String, required: true, default: `testusername${Date.now()}`},
    password: {type: String, required: true, default: `testpassword${Date.now()}`},
    firstName: String,
    lastName: String,
    email: {type: String, required: true, default: `testemail${Date.now()}`},
    profilePhoto: String,
    headerImage: String,
    accountType: {type: String, default: 'PERSONAL', enum: ['PERSONAL', 'ACADEMIC', 'PROFESSIONAL']},
    maritalStatus: {type: String, default: 'SINGLE', enum: ['MARRIED', 'SINGLE', 'WIDOWED']},
    biography: String,
    dateOfBirth: Date,
    joined: {type: Date, default: Date.now},
    location: {
        latitude: Number,
        longitude: Number
    },
}, {collection: 'users'});
export default UserSchema;

