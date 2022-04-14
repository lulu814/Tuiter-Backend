/**
 * @file Declares API for Bookmarks related data access object methods
 */
import Bookmark from "../models/bookmarks/Bookmark";
export default interface BookmarkDaoI {
    findAllUsersThatBookmarkedTuit (tid: string): Promise<Bookmark[]>;
    findAllTuitsBookmarkedByUser (uid: string): Promise<Bookmark[]>;
    userBookmarksTuit (tid: string, uid: string): Promise<Bookmark>;
    userUnbookmarksTuit (tid: string, uid: string): Promise<any>;
    userUnbookmarksAllTuit (uid: string): Promise<any>;
};