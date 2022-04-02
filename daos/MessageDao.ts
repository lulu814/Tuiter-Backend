/**
 * @file Implements DAO managing data storage of messages. Uses mongoose MessageModel
 * to integrate with MongoDB
 */
import MessageDaoI from "../interfaces/MessageDaoI";
import MessageModel from "../mongoose/messages/MessageModel";
import Message from "../models/messages/Message";

/**
 * @class MessageDao Implements Data Access Object managing data storage
 * of Messages
 * @implements {MessageDaoI} MessageDaoI
 * @property {MessageDao} messageDao Private single instance of MessageDao
 */
export default class MessageDao implements MessageDaoI {
    private static messageDao: MessageDao | null = null;
    public static getInstance = (): MessageDao => {
        if(MessageDao.messageDao === null) {
            MessageDao.messageDao = new MessageDao();
        }
        return MessageDao.messageDao;
    }
    private constructor() {}
    /**
     * Uses MessageModel to retrieve all message documents from messages collection sent by a user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the messages are retrieved from database
     */
    findAllMessagesSentByUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({from: uid})
            .populate("to")
            .exec();
    /**
     * Uses MessageModel to retrieve all message documents from messages collection sent to a user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the messages are retrieved from database
     */
    findAllMessagesSentToUser = async (uid: string): Promise<Message[]> =>
        MessageModel
            .find({to: uid})
            .populate("from")
            .exec();
    /**
     * Inserts message instance into the database under user context
     * @param {string} source_uid source/actor user's primary key
     * @param {string} target_uid target user's primary key
     * @param {Message} message Instance to be inserted into the database
     * @returns Promise To be notified when message is inserted into the database
     */
    userSendsMessage = async (source_uid: string, target_uid: string, message: Message): Promise<Message> =>
        MessageModel.create({...message, to: target_uid, from: source_uid});
    /**
     * Removes message from the database.
     * @param {string} mid Primary key of message to be removed
     * @returns Promise To be notified when message is removed from the database
     */
    userDeletesOneMessage = async (mid: string): Promise<any> =>
        MessageModel.deleteOne({_id:mid});
    /**
     * Removes all messages sent by a user from the database.
     * @param {string} uid Primary key of User that sent the messages to be removed
     * @returns Promise To be notified when messages are removed from the database
     */
    userDeletesAllSentMessage = async (uid: string): Promise<any> =>
        MessageModel.deleteMany({from: uid})
    /**
     * Removes all messages received by a user from the database.
     * @param {string} uid Primary key of User that received the messages to be removed
     * @returns Promise To be notified when messages are removed from the database
     */
    userDeletesAllReceivedMessage = async (uid: string): Promise<any> =>
        MessageModel.deleteMany({to: uid})
}