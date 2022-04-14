/**
 * @file Implements DAO managing data storage of tuits. Uses mongoose TuitModel
 * to integrate with MongoDB
 */
import TuitModel from "../mongoose/tuits/TuitModel";
import Tuit from "../models/tuits/Tuit";
import TuitDaoI from "../interfaces/TuitDaoI";

/**
 * @class TuitDao Implements Data Access Object managing data storage
 * of Tuits
 * @implements {TuitDaoI} TuitDaoI
 * @property {TuitDao} tuitDao Private single instance of TuitDao
 */
export default class TuitDao implements TuitDaoI{
    private static tuitDao: TuitDao | null = null;
    public static getInstance = (): TuitDao => {
        if(TuitDao.tuitDao === null) {
            TuitDao.tuitDao = new TuitDao();
        }
        return TuitDao.tuitDao;
    }
    private constructor() {}
    /**
     * Uses TuitModel to retrieve all tuit documents from tuits collection
     * @returns Promise To be notified when the tuits are retrieved from
     * database
     */
    findAllTuits = async (): Promise<Tuit[]> =>
        TuitModel.find()
            .populate("postedBy")
            .exec();
    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection using the uid
     * @param {string} uid User's primary key
     * @returns Promise To be notified when tuit is retrieved from the database
     */
    findAllTuitsByUser = async (uid: string): Promise<Tuit[]> =>
        TuitModel.find({postedBy: uid})
            .sort({'postedOn': -1})
            .populate("postedBy")
            .exec();
    /**
     * Uses TuitModel to retrieve single tuit document from tuits collection
     * @param {string} tid User's primary key
     * @returns Promise To be notified when tuit is retrieved from the database
     */
    findTuitById = async (tid: string): Promise<any> =>
        TuitModel.findById(tid)
            .populate("postedBy")
            .exec();
    /**
     * Inserts tuit instance into the database under user context
     * @param {string} uid User's primary key
     * @param {Tuit} tuit Instance to be inserted into the database
     * @returns Promise To be notified when tuit is inserted into the database
     */
    createTuitByUser = async (uid: string, tuit: Tuit): Promise<Tuit> =>
        TuitModel.create({...tuit, postedBy: uid});
    /**
     * Updates tuit with new values in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {Tuit} tuit object containing properties and their new values
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateTuit = async (tid: string, tuit: Tuit): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: tuit});
    /**
     * Removes tuit from the database.
     * @param {string} tid Primary key of tuit to be removed
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuit = async (tid: string): Promise<any> =>
        TuitModel.deleteOne({_id: tid});

    /**
     * Updates tuit's stats in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {any} newStats object of ne stats
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateLikes = async (tid: string, newStats: any): Promise<any> =>
        TuitModel.updateOne(
            {_id: tid},
            {$set: {stats: newStats}}
        );

    /**
     * Removes tuit from the database. Used for testing
     * @param {string} uid Primary key of the dummy user whose tuit to be removed
     * @returns Promise To be notified when tuit is removed from the database
     */
    deleteTuitByUserId = async (uid: string): Promise<any> =>
        TuitModel.deleteOne({postedBy: uid});

    /**
     * Updates tuit's stats in database
     * @param {string} tid Primary key of tuit to be modified
     * @param {any} newStats object of new stats
     * @returns Promise To be notified when tuit is updated in the database
     */
    updateBookmarks = async(tid:string, newStats:any): Promise <any> =>
        TuitModel.updateOne ({_id:tid},
            {$set: {stats: newStats}});


}
