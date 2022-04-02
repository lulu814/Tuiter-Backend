/**
 * @file Implements DAO managing data storage of follows. Uses mongoose FollowModel
 * to integrate with MongoDB
 */
import FollowDaoI from "../interfaces/FollowDaoI";
import FollowModel from "../mongoose/follows/FollowModel";
import Follow from "../models/follows/Follow";

/**
 * @class FollowDao Implements Data Access Object managing data storage
 * of Follows
 * @implements {FollowDaoI} FollowDaoI
 * @property {FollowDao} followDao Private single instance of FollowDao
 */
export default class FollowDao implements FollowDaoI {
    private static followDao: FollowDao | null = null;
    public static getInstance = (): FollowDao => {
        if(FollowDao.followDao === null) {
            FollowDao.followDao = new FollowDao();
        }
        return FollowDao.followDao;
    }
    private constructor() {}
    /**
     * Uses FollowModel to retrieve all users followed by a user from follows collection
     * @param {string} uid actor user's primary key
     * @returns Promise To be notified when the follows are retrieved from database
     */
    findAllUsersThatUserIsFollowing = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowing: uid})
            .populate("userFollowed")
            .exec();
    /**
     * Uses FollowModel to retrieve all users following a user from follows collection
     * @param {string} uid actor user's primary key
     * @returns Promise To be notified when the follows are retrieved from database
     */
    findAllUsersThatUserIsFollowedBy = async (uid: string): Promise<Follow[]> =>
        FollowModel
            .find({userFollowed: uid})
            .populate("userFollowing")
            .exec();
    /**
     * Inserts follow instance into the database under user context shows one user follows another
     * @param {string} source_uid source/actor user's primary key
     * @param {string} target_uid target user's primary key
     * @returns Promise To be notified when the follow is inserted into database
     */
    userFollowsAnotherUser = async (source_uid: string, target_uid: string): Promise<Follow> =>
        FollowModel.create({userFollowing: source_uid, userFollowed: target_uid});
    /**
     * Removes follow instance from the database
     * @param {string} source_uid source/actor user's primary key
     * @param {string} target_uid target user's primary key
     * @returns Promise To be notified when the follow is removed from database
     */
    userUnFollowsAnotherUser = async (source_uid: string, target_uid: string): Promise<any> =>
        FollowModel.deleteOne({userFollowing: source_uid, userFollowed: target_uid});
    /**
     * Removes all follow instances from the database initiated by a user
     * @param {string} uid source/actor user's primary key
     * @returns Promise To be notified when all follows are removed from database
     */
    userUnFollowsAllUsers = async (uid: string): Promise<any> =>
        FollowModel.deleteMany({userFollowing: uid})
    /**
     * Removes all follow instances from the database that have a target user
     * @param {string} uid target_uid target user's primary key
     * @returns Promise To be notified when all follows are removed from database
     */
    userDeletesAllFollowers = async (uid: string): Promise<any> =>
        FollowModel.deleteMany({userFollowed: uid})
}