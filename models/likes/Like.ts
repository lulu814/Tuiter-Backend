import Tuit from "../tuits/Tuit";
import User from "../users/User";

export default interface Like {
    tuit: Tuit,
    likedBy: User
};