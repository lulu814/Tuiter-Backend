/**
 * @file Implements mongoose schema for dislikes
 */
import mongoose, {Schema} from "mongoose";
import Dislike from "../../models/likes/Dislike";

/**
 * @typedef Dislike Represents the dislike relation between a user and a tuit
 * @property {ObjectId} tuit The id of the tuit disliked by user
 * @property {ObjectId} dislikedBy The id of the user
 */
const DislikeSchema = new mongoose.Schema<Dislike>({
    tuit: {type: Schema.Types.ObjectId, ref: "TuitModel"},
    dislikedBy: {type: Schema.Types.ObjectId, ref: "UserModel"},
}, {collection: "dislikes"});
export default DislikeSchema;