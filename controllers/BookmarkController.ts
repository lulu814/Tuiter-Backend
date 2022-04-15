/**
 * @file Controller RESTful Web service API for bookmarks resource
 */
import {Express, Request, Response} from "express";
import BookmarkDao from "../daos/BookmarkDao";
import BookmarkControllerI from "../interfaces/BookmarkControllerI";
import TuitDao from "../daos/TuitDao";

/**
 * @class BookmarkController Implements RESTful Web service API for bookmarks resource.
 * Defines the following HTTP endpoints:
 * <ul>
 *     <li>GET /api/users/:uid/bookmarks to retrieve all the tuits bookmarked by a user
 *     </li>
 *     <li>GET /api/tuits/:tid/bookmarks to retrieve all users that bookmarked a tuit
 *     </li>
 *     <li>POST /api/users/:uid/bookmarks/:tid to record that a user bookmarks a tuit
 *     </li>
 *     <li>DELETE /api/users/:uid/bookmarks/:tid to record that a user
 *     no londer bookmarks a tuit</li>
 *    <li>DELETE /api/users/:uid/bookmarks to record that a user
 *     no londer bookmark any tuit</li>
 *     <li>PUT /api/users/:uid/bookmarks/:tid to toggle that a user bookmarks a tuit
 *     </li>
 *     <li>GET /api/users/:uid/bookmarks/:tid to retrieve that a user bookmarked a tuit
 *     </li>
 * </ul>
 * @property {BookmarkDao} BookmarkDao Singleton DAO implementing bookmarks CRUD operations
 * @property {BookmarkController} BookmarkController Singleton controller implementing
 * RESTful Web service API
 */
export default class BookmarkController implements BookmarkControllerI {
    private static bookmarkDao: BookmarkDao = BookmarkDao.getInstance();
    private static tuitDao: TuitDao = TuitDao.getInstance();
    private static bookmarkController: BookmarkController | null = null;
    /**
     * Creates singleton controller instance
     * @param {Express} app Express instance to declare the RESTful Web service
     * API
     * @return BookmarkController
     */
    public static getInstance = (app: Express): BookmarkController => {
        if(BookmarkController.bookmarkController === null) {
            BookmarkController.bookmarkController = new BookmarkController();
            app.get("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.findAllTuitsBookmarkedByUser);
            app.get("/api/tuits/:tid/bookmarks", BookmarkController.bookmarkController.findAllUsersThatBookmarkedTuit);
            app.post("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userBookmarksTuit);
            app.delete("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userUnbookmarksTuit);
            app.delete("/api/users/:uid/bookmarks", BookmarkController.bookmarkController.userUnbookmarksAllTuit);
            app.put("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.userTogglesTuitBookmarks);
            app.get("/api/users/:uid/bookmarks/:tid", BookmarkController.bookmarkController.findUserBookmarkedTuit);
        }
        return BookmarkController.bookmarkController;
    }

    private constructor() {}

    /**
     * Retrieves all users that bookmarked a tuit from the database
     * @param {Request} req Represents request from client, including the path
     * parameter tid representing the bookmarked tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the bookmark objects
     */
    findAllUsersThatBookmarkedTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.findAllUsersThatBookmarkedTuit(req.params.tid)
            .then(users => res.json(users));

    /**
     * Retrieves all tuits bookmarked by a user from the database
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user bookmarked the tuits
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON arrays containing the tuit objects that were bookmarked
     */
    findAllTuitsBookmarkedByUser = (req: Request, res: Response) => {
        const uid = req.params.uid
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        try {
            BookmarkController.bookmarkDao.findAllTuitsBookmarkedByUser(userId)
                .then(bookmarks => {
                    const bookmarksNonNullTuits = bookmarks.filter(bookmark => bookmark.bookmarkedTuit)
                    const tuitsFromBookmarks = bookmarksNonNullTuits.map(bookmark => bookmark.bookmarkedTuit);
                    res.json(tuitsFromBookmarks)
                })
        } catch (e) {
            res.sendStatus(404);
        }
    }

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userBookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userBookmarksTuit(req.params.uid, req.params.tid)
            .then(bookmarks => res.json(bookmarks));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuit being bookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksTuit(req.params.uid, req.params.tid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is unbookmarking
     * the tuit and the tuits being bookmarked
     * @param {Response} res Represents response to client, including status
     * on whether deleting the bookmark was successful or not
     */
    userUnbookmarksAllTuit = (req: Request, res: Response) =>
        BookmarkController.bookmarkDao.userUnbookmarksAllTuit(req.params.uid)
            .then(status => res.send(status));

    /**
     * @param {Request} req Represents request from client, including the
     * path parameters uid and tid representing the user that is bookmarking the tuit
     * and the tuit being bookmarked
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON containing the new bookmarks that was inserted in the
     * database
     */
    userTogglesTuitBookmarks = async (req: Request, res: Response) => {
        const bookmarkDao = BookmarkController.bookmarkDao;
        const tuitDao = BookmarkController.tuitDao;
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        try {
            const userAlreadyBookmarkedTuit = await bookmarkDao.findUserBookmarksTuit(userId, tid);
            const howManyBookmarkedTuit = await bookmarkDao.countHowManyBookmarkedTuit(tid);
            let tuit = await tuitDao.findTuitById(tid);
            if (userAlreadyBookmarkedTuit) {
                await bookmarkDao.userUnbookmarksTuit(userId, tid);
                tuit.stats.bookmarks = howManyBookmarkedTuit - 1;
            } else {
                await BookmarkController.bookmarkDao.userBookmarksTuit(userId, tid);
                tuit.stats.bookmarks = howManyBookmarkedTuit + 1;
            }
            await tuitDao.updateBookmarks(tid, tuit.stats);
            res.sendStatus(200);
        } catch (e) {
        res.sendStatus(400);
        }
    }

    /**
     * Check if the user has already bookmarked the tuit
     * @param {Request} req Represents request from client, including the path
     * parameter uid representing the user, and the tid representing the tuit
     * @param {Response} res Represents response to client, including the
     * body formatted as JSON object containing the bookmark objects or null
     */
    findUserBookmarkedTuit = async (req: Request, res: Response) => {
        const uid = req.params.uid;
        const tid = req.params.tid;
        // @ts-ignore
        const profile = req.session['profile'];
        const userId = uid === 'me' && profile ?
            profile._id : uid;
        if (userId === "me") {
            res.sendStatus(503);
            return;
        }
        BookmarkController.bookmarkDao.findUserBookmarksTuit(userId, tid)
            .then(bookmark => res.json(bookmark));
        }
};
