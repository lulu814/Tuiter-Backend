/**
 * @file Declares controller RESTful API for Messages resource
 */
import {Request, Response} from "express";

export default interface MessageControllerI {
    findAllMessagesSentByUser (req: Request, res: Response): void;
    findAllMessagesSentToUser (req: Request, res: Response): void;
    userSendsMessage (req: Request, res: Response): void;
    userDeletesOneMessage (req: Request, res: Response): void;
    userDeletesAllSentMessage (req: Request, res: Response): void;
    userDeletesAllReceivedMessage (req: Request, res: Response): void;
};