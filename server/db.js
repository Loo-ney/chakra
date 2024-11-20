import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config(); // Load environment variables from .env file

const connectToDatabase = async () => {
    try {
        mongoose.set('strictQuery', false); // Avoid deprecation warnings
        
        // Log the value of MONGO_URI to verify it's being loaded correctly
        console.log('MONGO_URI:', process.env.MONGO_URI);

        const connect = await mongoose.connect(process.env.MONGO_URI, {});
        
        console.log(`MongoDb Connected: ${connect.connection.host}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        //process.exit(1) 
    }
}

export default connectToDatabase;