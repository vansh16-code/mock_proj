import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  gender: String,
  description: String,
  image: [String], // Now an array
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  isAdopted: { type: Boolean, default: false }
});


export default mongoose.model('Dog', dogSchema);

