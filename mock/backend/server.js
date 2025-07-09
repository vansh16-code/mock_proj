
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
import dogrouter from './routes/dogRoutes.js';
import router from './routes/userRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());
app.use(cookieParser());

//routes

app.use('/api/dogs', dogrouter);
app.use('/api/users', router);


// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));


// Start server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});