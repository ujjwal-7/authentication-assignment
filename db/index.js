const mongoose = require('mongoose');
require('dotenv').config();

const connectToDb = async () => {

    try {
        const connection = await mongoose.connect(`${process.env.MONGODB_CONNECTION_STRING}/${process.env.DATABASE_NAME}`);
        console.log('Connected to database');
        return connection;
        
    } catch(e) {
        console.log(e);
    }
}

module.exports = connectToDb;