import express from 'express';
import Dog from '../models/dog.js';
import auth from "../middleware/authMiddleware.js"



const dogrouter = express.Router();

dogrouter.get('/postdogs', async (req, res) => {
  try {
    // Sample mock dog data
    const sampleDogs = [
      {
        name: "Buddy",
        breed: "Golden Retriever",
        age: 3,
        gender: "Male",
        description: "Friendly and energetic. Loves kids and playing fetch.",
        image: "https://example.com/images/buddy.jpg"
      },
      {
        name: "Luna",
        breed: "German Shepherd",
        age: 5,
        gender: "Female",
        description: "Calm, loyal, and very intelligent. Perfect for a family.",
        image: "https://example.com/images/luna.jpg"
      },
      {
        name: "Charlie",
        breed: "Beagle",
        age: 2,
        gender: "Male",
        description: "Small, playful, and loves cuddles. Great for apartments.",
        image: "https://example.com/images/charlie.jpg"
      },
      {
        name: "Daisy",
        breed: "Labrador Retriever",
        age: 4,
        gender: "Female",
        description: "Affectionate and smart. Gets along with other pets.",
        image: "https://example.com/images/daisy.jpg"
      },
      {
        name: "Rocky",
        breed: "Siberian Husky",
        age: 2,
        gender: "Male",
        description: "Energetic and independent. Needs daily exercise.",
        image: "https://example.com/images/rocky.jpg"
      }
    ];

    // Insert sample data
    const insertedDogs = await Dog.insertMany(sampleDogs);

    return res.status(201).json({ success: true, message: "Dogs inserted", data: insertedDogs });
  } catch (error) {
    console.error("Error inserting dogs:", error);
    return res.status(500).json({ success: false, message: "Failed to insert dogs", error });
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

dogrouter.post('/addDog', auth, async (req, res) => {
  try {
    const { name, breed, age, description, image } = req.body;
    const userId = req.user.userId; // Set by auth middleware from token

    const newDog = new Dog({
      name,
      breed,
      age,
      description,
      image,
      postedBy: userId, // Link to User schema
    });

    const savedDog = await newDog.save();

    res.status(201).json({
      message: 'Dog posted successfully',
      dog: savedDog,
    });
  } catch (err) {
    res.status(500).json({
      message: 'Error posting dog',
      error: err.message,
    });
  }
});



// // POST /api/dogs/adddog
// dogrouter.post('/submitDogAndUser', async (req, res) => {
//   try {
//     const {
//       userName,
//       userEmail,
//       userPhone,
//       dogName,
//       dogBreed,
//       dogAge,
//       dogDescription,
//       dogImage,
//     } = req.body;

//     // Create user
//     const newUser = new User({
//       name: userName,
//       email: userEmail,
//       phone: userPhone,
//     });

//     const savedUser = await newUser.save();

//     // Create dog linked to this user
//     const newDog = new Dog({
//       name: dogName,
//       breed: dogBreed,
//       age: dogAge,
//       description: dogDescription,
//       image: dogImage,
//       postedBy: savedUser._id,
//     });

//     const savedDog = await newDog.save();

//     return res.status(201).json({
//       success: true,
//       message: 'Dog and user submitted successfully',
//       user: savedUser,
//       dog: savedDog,
//     });

//   } catch (err) {
//     return res.status(500).json({ success: false, message: 'Server error', error: err.message });
//   }
// });








export default dogrouter;