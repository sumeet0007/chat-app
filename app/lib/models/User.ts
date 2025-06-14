import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String, // only if you're handling auth manually
  id : String,
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
});

export default mongoose.models.User || mongoose.model('User', userSchema);
