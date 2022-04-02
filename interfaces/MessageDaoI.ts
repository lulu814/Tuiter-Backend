/**
 * @file Declares API for Bookmarks related data access object methods
 */
import Message from "../models/messages/Message";

export default interface MessageDaoI {
    findAllMessagesSentByUser (uid: string): Promise<Message[]>;
    findAllMessagesSentToUser (uid: string): Promise<Message[]>;
    userSendsMessage (source_uid: string, target_uid: string,  message: Message): Promise<Message>;
    userDeletesOneMessage (mid: string): Promise<any>;
    userDeletesAllSentMessage (uid: string): Promise<any>;
    userDeletesAllReceivedMessage (uid: string): Promise<any>;
};