/**
 * @file Implements mongoose schema for tuits
 */
import mongoose, {Schema} from "mongoose";
import Tuit from "../../models/tuits/Tuit";

/**
 * @typedef Tuit Represents the tuit object
 * @property {string} tuit The content of the tuit
 * @property {ObjectId} postedBy The user that posted the tuit
 * @property {date} postedOn The date the tuit is posted
 * @property {string} image The image link in the tuit
 * @property {string} youtube The youtube link in the tuit
 * @property {string} imageOverlay The imageOverlay in the tuit
 * @property {object} stats The stats object in the tuit including count of
 * reply, retuit, and like
 */
const TuitSchema = new mongoose.Schema<Tuit>({
    tuit: {type: String, required: true},
    postedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
    postedOn: {type: Date, default: Date.now},
    image: String,
    youtube: String,
    avatarLogo: String,
    imageOverlay: String,
    stats: {
        replies: {type: Number, default: 0},
        retuits: {type: Number, default: 0},
        likes: {type: Number, default: 0},
        dislikes: {type: Number, default: 0},
        bookmarks: {type: Number, default: 0}
    }
}, {collection: "tuits"});
export default TuitSchema;

