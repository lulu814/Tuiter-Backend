import User from "../users/User";

export default interface Follow {
    userFollowing: User,
    userFollowed: User
};