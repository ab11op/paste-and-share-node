import mongoose from "mongoose";
import logger from './logger.js'
const url = process.env.MONGO_URI
const dbConnection  = () => {
    mongoose.connect(url).then(()=>{
        logger.info(`connected to the database`)
    }).catch(err => logger.error(`error in connecting to the database: ${err}`))
}

export default dbConnection