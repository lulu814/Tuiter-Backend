/**
 * @file Implements DAO managing data storage of bookmarks. Uses mongoose BookmarkModel
 * to integrate with MongoDB
 */
import BookmarkDaoI from "../interfaces/BookmarkDaoI";
import BookmarkModel from "../mongoose/bookmarks/BookmarkModel";
import Bookmark from "../models/bookmarks/Bookmark";

/**
 * @class BookmarkDao Implements Data Access Object managing data storage
 * of Bookmarks
 * @implements {BookmarkDaoI} BookmarkDaoI
 * @property {BookmarkDao} bookmarkDao Private single instance of BookmarkDao
 */
export default class BookmarkDao implements BookmarkDaoI {
    private static bookmarkDao: BookmarkDao | null = null;
    public static getInstance = (): BookmarkDao => {
        if(BookmarkDao.bookmarkDao === null) {
            BookmarkDao.bookmarkDao = new BookmarkDao();
        }
        return BookmarkDao.bookmarkDao;
    }
    private constructor() {}
    /**
     * Uses BookmarkModel to retrieve all users from bookmarks collection bookmarked a tuit
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when the bookmarks are retrieved from database
     */
    findAllUsersThatBookmarkedTuit = async (tid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedTuit: tid})
            .populate("bookmarkedBy")
            .exec();
    /**
     * Uses BookmarkModel to retrieve all tuits from bookmarks collection bookmarked by a user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when the bookmarks are retrieved from database
     */
    findAllTuitsBookmarkedByUser = async (uid: string): Promise<Bookmark[]> =>
        BookmarkModel
            .find({bookmarkedBy: uid})
            .populate("bookmarkedTuit")
            .exec();
    /**
     * Inserts bookmark instance into the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when bookmark is inserted into the database
     */
    userBookmarksTuit = async (uid: string, tid: string): Promise<Bookmark> =>
        BookmarkModel.create({bookmarkedTuit: tid, bookmarkedBy: uid});
    /**
     * Remove bookmark instance from the database
     * @param {string} uid User's primary key
     * @param {string} tid Tuit's primary key
     * @returns Promise To be notified when bookmark is removed from the database
     */
    userUnbookmarksTuit = async (uid: string, tid: string): Promise<any> =>
        BookmarkModel.deleteOne({bookmarkedTuit: tid, bookmarkedBy: uid});
    /**
     * Remove all bookmark instances from the database bookmarked by a user
     * @param {string} uid User's primary key
     * @returns Promise To be notified when bookmarks are removed from the database
     */
    userUnbookmarksAllTuit = async (uid: string): Promise<any> =>
        BookmarkModel.deleteMany({bookmarkedBy: uid})

    findUserBookmarksTuit = async(uid: string, tid:string) : Promise<any> =>
        BookmarkModel.findOne({bookmarkedTuit:tid, bookmarkedBy:uid})

    countHowManyBookmarkedTuit = async (tid:string): Promise<any> =>
        BookmarkModel.count({bookmarkedTuit:tid});


}
