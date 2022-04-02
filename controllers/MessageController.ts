/**
 * @file Controller RESTful Web service API for messages resource
 */
import {Express, Request, Response} from "express";
import MessageDao from "../daos/MessageDao";
import MessageControllerI from "../interfaces/MessageControllerI";

/**
 * @class MessageController Implements RESTful Web service API for messages resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/messages to retrieve all messages sent by a user
 *     </li>
 *     <li>GET /api/users/:uid/messages_received to retrieve all messages received by a user
 *     </li>
 *     <li>POST /api/users/:source_uid/messages/:target_uid to record that a user sent a message
 *     </li>
 *     <li>DELETE /api/messages/:mid to remove a particular message instance
 *     </li>
 *     <li>DELETE /api/users/:uid/messages to remove all messages sent to a user
 *     </li>
 *     <li>DELETE /api/users/:uid/messages_received to remove all messages received  by a user
 *     </li>
 * </ul>
 * @property {MessageDao} messageDao Singleton DAO implementing messages CRUD operations
 * @property {MessageController} MessageController Singleton controller implementing
 * RESTful Web service API
 */
export default class MessageController implements MessageControllerI {
    private static messageDao: MessageDao = MessageDao.getInstance();
    private static messageController: MessageController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return MessageController
     */
    public static getInstance = (app: Express): MessageController => {
        if (MessageController.messageController === null) {
            MessageController.messageController = new MessageController();
            app.get("/api/users/:uid/messages", MessageController.messageController.findAllMessagesSentByUser);
            app.get("/api/users/:uid/messages_received", MessageController.messageController.findAllMessagesSentToUser);
            app.post("/api/users/:source_uid/messages/:target_uid", MessageController.messageController.userSendsMessage);
            app.delete("/api/messages/:mid", MessageController.messageController.userDeletesOneMessage);
            app.delete("/api/users/:uid/messages", MessageController.messageController.userDeletesAllSentMessage);
            app.delete("/api/users/:uid/messages_received", MessageController.messageController.userDeletesAllReceivedMessage);
        }
        return MessageController.messageController;
    }

    private constructor() {}

    /**
     * Retrieves all messages sent by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing user sent the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the message objects
     */
    findAllMessagesSentByUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentByUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * Retrieves all messages sent to a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing user sent the messages
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the messages user received
     */
    findAllMessagesSentToUser = (req: Request, res: Response) =>
        MessageController.messageDao.findAllMessagesSentToUser(req.params.uid)
            .then(messages => res.json(messages));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters source_uid and target_id representing the source user sent
     * the message to target_user and body containing the JSON object for the new
     * message to be inserted in the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userSendsMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userSendsMessage(req.params.source_uid, req.params.target_uid, req.body)
            .then(messages => res.json(messages));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters mid representing the id of message to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the message was successful or not
     */
    userDeletesOneMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesOneMessage(req.params.mid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user that is remove all
     * the messages sent by the user
     * @param {Response} res Represents response to client, including status
     * on whether deleting the messages was successful or not
     */
    userDeletesAllSentMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesAllSentMessage(req.params.uid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user that is remove all
     * the messages received by the user
     * @param {Response} res Represents response to client, including status
     * on whether deleting the messages was successful or not
     */
    userDeletesAllReceivedMessage = (req: Request, res: Response) =>
        MessageController.messageDao.userDeletesAllReceivedMessage(req.params.uid)
            .then(status => res.send(status));
};