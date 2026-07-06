import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mubashir_alam');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Warning: MongoDB Connection failed (${error.message}). The server will start, and Mongoose will attempt to reconnect once database is available.`);
  }
};

export default connectDB;
