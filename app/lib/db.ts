import mongoose from 'mongoose';

export const connectDB = async () => {
  if (mongoose.connections[0].readyState) return;
  await mongoose.connect('mongodb+srv://Admin:Admin@cluster0.bchyvzo.mongodb.net/<dbname>?retryWrites=true&w=majority&tls=true');
};

export const disconnectDB = async () => {
  await mongoose.disconnect();
};