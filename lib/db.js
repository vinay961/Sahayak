import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;

if(!MONGO_URI) {
  throw new Error('Please define the MONGO_URI environment variable inside .env.local');
}

let cached = global.mongoose;
if(!cached) {
    cached = global.mongoose = { conn: null, promise: null }; // We are using global object to store the cached connection and promise so that it can be reused across hot reloads in development
}

async function dbConnect() {
    if(cached.conn) {
        return cached.conn;
    }

    if(!cached.promise) {
        cached.promise = mongoose.connect(MONGO_URI).then((mongoose) => {
            return mongoose; // Return the mongoose instance, It contain the connection object like mongoose.connection which we can use later so we save it in cached.conn
        });
    }
    cached.conn = await cached.promise;
    return cached.conn;
}

export default dbConnect;

