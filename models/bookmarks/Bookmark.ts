import User from "../users/User";
import Tuit from "../tuits/Tuit";

export default interface Bookmark {
    bookmarkedTuit: Tuit,
    bookmarkedBy: User
};