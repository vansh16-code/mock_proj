import express from 'express';
import Dog from '../models/dog.js';
import User from '../models/User.js';
import auth from "../middleware/authMiddleware.js"
import { v2 as cloudinary } from 'cloudinary';
import nodemailer from 'nodemailer';
import multer from 'multer';
const dogrouter = express.Router();
const upload = multer({ storage: multer.memoryStorage() });
const uploadToCloudinary = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { resource_type: 'image' },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    stream.end(fileBuffer);
  });
};

dogrouter.post('/requestAdoption/:id', auth, async (req, res) => {
  try {
    const dogId = req.params.id;
    const dog = await Dog.findById(dogId).populate('postedBy', '-password');
    if (!dog) return res.status(404).json({ message: 'Dog not found' });

    const dogPoster = dog.postedBy;
    const adopter = await User.findById(req.user.userId);

    // Set up nodemailer transporter (using Gmail for example)
    const transporter = nodemailer.createTransport({
        host: "smtp-relay.brevo.com",
         port: 587,
         secure: false, 
      auth: {
        user: process.env.EMAIL_USER,    
        pass: process.env.EMAIL_PASS       
      }
    });

    const mailOptions = {
       from: '"Pet Portal" <bhawandeepsingh976@gmail.com>',
      to: dogPoster.email,
      subject: `Adoption Request for ${dog.name}`,
      text: `
Hi ${dogPoster.name},

Your dog "${dog.name}" has received an adoption request!

Requested by:
Name: ${adopter.name}
Email: ${adopter.email}
Phone: ${adopter.phone}

You can reach out to the requester to proceed further.

Regards,
Pet Adoption Team
      `
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: 'Adoption request sent to the dog owner.' });

  } catch (error) {
    console.error('Error sending adoption request:', error);
    res.status(500).json({ message: 'Failed to send adoption request', error: error.message });
  }
});






dogrouter.get('/viewdogs', async (req, res) => {
  try {
    const dogs = await Dog.find().populate('postedBy', 'name email phone');
    return res.json({ success: true, data: dogs });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
});


dogrouter.get('/viewdogs/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const dog = await Dog.findById(id);

    if (!dog) {
      return res.status(404).json({ success: false, message: 'Dog not found' });
    }

    return res.json({ success: true, data: dog });
  } catch (error) {
    return res.status(500).json({ success: false, message: 'Server Error', error });
  }
});


dogrouter.post('/addDog', auth,upload.array('images', 5), async (req, res) => {
  try {
    const { name, breed, age, gender, description } = req.body;
    const userId = req.user.userId;

    const imageUploadPromises = req.files.map(file => uploadToCloudinary(file.buffer));
    const uploadResults = await Promise.all(imageUploadPromises);

    const imageUrls = uploadResults.map(result => result.secure_url);

    const newDog = new Dog({
      name,
      breed,
      age,
      gender,
      description,
      image: imageUrls,
      postedBy: userId,
    });

    await newDog.save();
    return res.status(201).json({ success: true, data: newDog });

  } catch (err) {
    console.error('Add dog error:', err);
    return res.status(500).json({ success: false, message: 'Something went wrong' });
  }
});




export default dogrouter;