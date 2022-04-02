/**
 * @file Declares API for Follows related data access object methods
 */
import Follow from "../models/follows/Follow";

export default interface FollowDaoI {
    findAllUsersThatUserIsFollowing (uid: string): Promise<Follow[]>;
    findAllUsersThatUserIsFollowedBy (uid: string): Promise<Follow[]>;
    userFollowsAnotherUser (source_uid: string, target_uid: string): Promise<Follow>;
    userUnFollowsAnotherUser (source_uid: string, target_uid: string): Promise<any>;
    userUnFollowsAllUsers (uid: string): Promise<any>;
    userDeletesAllFollowers (uid: string): Promise<any>;
};