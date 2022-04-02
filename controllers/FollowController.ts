/**
 * @file Controller RESTful Web service API for follows resource
 */
import {Express, Request, Response} from "express";
import FollowDao from "../daos/FollowDao";
import FollowControllerI from "../interfaces/FollowControllerI";

/**
 * @class FollowController Implements RESTful Web service API for follows resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/follows to retrieve a list of users user is following
 *     </li>
 *     <li>GET /api/users/:uid/followers to retrieve a list of users that are following the user
 *     </li>
 *     <li>POST /api/users/:source_uid/follows/:target_uid to record that a user follows another user
 *     </li>
 *     <li>DELETE /api/users/:source_uid/follows/:target_uid to record that a user unfollows another user
 *     </li>
 *     <li>DELETE /api/users/:uid/follows to unfollow all other users
 *     </li>
 *     <li>DELETE /api/users/:uid/followers to remove all the followers
 *     </li>
 * </ul>
 * @property {FollowDao} followDao Singleton DAO implementing follows CRUD operations
 * @property {FollowController} FollowController Singleton controller implementing
 * RESTful Web service API
 */
export default class FollowController implements FollowControllerI {
    private static followDao: FollowDao = FollowDao.getInstance();
    private static followController: FollowController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return FollowController
     */
    public static getInstance = (app: Express): FollowController => {
        if (FollowController.followController === null) {
            FollowController.followController = new FollowController();
            app.get("/api/users/:uid/follows", FollowController.followController.findAllUsersThatUserIsFollowing);
            app.get("/api/users/:uid/followers", FollowController.followController.findAllUsersThatUserIsFollowedBy);
            app.post("/api/users/:source_uid/follows/:target_uid", FollowController.followController.userFollowsAnotherUser);
            app.delete("/api/users/:source_uid/follows/:target_uid", FollowController.followController.userUnFollowsAnotherUser);
            app.delete("/api/users/:uid/follows", FollowController.followController.userUnFollowsAllUsers);
            app.delete("/api/users/:uid/followers", FollowController.followController.userDeletesAllFollowers);
        }
        return FollowController.followController;
    }

    private constructor() {}

    /**
     * Retrieves all users a user is following from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the follow objects
     */
    findAllUsersThatUserIsFollowing = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersThatUserIsFollowing(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * Retrieves all users that a user is followed by from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing user
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the followers
     */
    findAllUsersThatUserIsFollowedBy = (req: Request, res: Response) =>
        FollowController.followDao.findAllUsersThatUserIsFollowedBy(req.params.uid)
            .then(follows => res.json(follows));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters source_uid and target_id representing the source user follows
     * the target_user and body containing the JSON object for the new
     * follow to be inserted in the database
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userFollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userFollowsAnotherUser(req.params.source_uid, req.params.target_uid)
            .then(follows => res.json(follows));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters source_uid and target_id representing the source user
     * follows the target user to be removed
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follow was successful or not
     */
    userUnFollowsAnotherUser = (req: Request, res: Response) =>
        FollowController.followDao.userUnFollowsAnotherUser(req.params.source_uid, req.params.target_uid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user that will unfollow other users
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follows was successful or not
     */
    userUnFollowsAllUsers = (req: Request, res: Response) =>
        FollowController.followDao.userUnFollowsAllUsers(req.params.uid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid representing the user that will remove all followers
     * @param {Response} res Represents response to client, including status
     * on whether deleting the follows was successful or not
     */
    userDeletesAllFollowers = (req: Request, res: Response) =>
        FollowController.followDao.userDeletesAllFollowers(req.params.uid)
            .then(status => res.send(status));
};