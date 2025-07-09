import mongoose from 'mongoose';

const dogSchema = new mongoose.Schema({
  name: String,
  breed: String,
  age: Number,
  gender: String,
  description: String,
  image: String,
adopted:{Boolean,default:false},
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
  
});

export default mongoose.model('Dog', dogSchema);

