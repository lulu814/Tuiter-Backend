/**
 * @file Declares controller RESTful API for Follows resource
 */
import {Request, Response} from "express";

export default interface FollowControllerI {
    findAllUsersThatUserIsFollowing (req: Request, res: Response): void;
    findAllUsersThatUserIsFollowedBy (req: Request, res: Response): void;
    userFollowsAnotherUser (req: Request, res: Response): void;
    userUnFollowsAnotherUser (req: Request, res: Response): void;
    userUnFollowsAllUsers (req: Request, res: Response): void;
    userDeletesAllFollowers (req: Request, res: Response): void;
};