import { log } from "console";
import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number
}

const connection: ConnectionObject = {};

async function dbConnection(): Promise<void> {
    if(connection.isConnected){
        console.log("Already Connected to Database");
        return;
    }

    try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {});
        console.log(db);

        connection.isConnected = db.connections[0].readyState;
        console.log("Database Connected Successfully");
    } catch (error) {
        console.log("Database connection failed");
        process.exit(1);
    }
}

export default dbConnection;
