import User from "../users/User";

export default interface Message {
    message: string,
    to: User,
    from: User,
    sentOn: Date
};