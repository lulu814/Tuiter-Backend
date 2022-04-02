import Tuit from "../tuits/Tuit";
import User from "../users/User";

export default interface Dislike {
    tuit: Tuit,
    dislikedBy: User
};