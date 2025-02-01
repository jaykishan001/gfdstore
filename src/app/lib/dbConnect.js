import mongoose from "mongoose";

const connection = {};

const dbConnect = async()=> {
    if(connection.isConnected){
        console.log("Already connected to the DB");
        return;
    }        
    try {
        const db = await mongoose.connect(process.env.MONGODB_URI, "", {});
        connection.isConnected = db.connections[0].readyState;
    } catch (error) {
        console.log("Error connecting to MongoDb", error);
        process.exit(1);
    }
}

export default dbConnect;
