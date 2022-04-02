import Dislike from "../models/likes/Dislike";

/**
 * @file Declares API for dislikes related data access object methods
 */
export default interface DislikeDaoI {
    findAllUsersThatDislikedTuit (tid: string): Promise<Dislike[]>;
    findAllTuitsDislikedByUser (uid: string): Promise<Dislike[]>;
    userDislikesTuit (tid: string, uid: string): Promise<Dislike>;
    userUndoDislikeTuit (tid: string, uid: string): Promise<any>;
    findUserDislikesTuit (tid: string, uid: string): Promise<any>;
    countHowManyDisikedTuit (tid: string): Promise<any>;
};