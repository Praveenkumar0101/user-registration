// const express = require('express');
// const mongoose = require('mongoose');
// const bodyParser = require('body-parser');
// const cors = require('cors');
// const crypto = require('crypto');
// require('dotenv').config();

// const app = express();

// // Middleware
// app.use(bodyParser.json());
// app.use(cors());

// // Connect to MongoDB
// mongoose.connect('mongodb://localhost:27017/UserDetails')
//   .then(() => {
//     console.log('MongoDB connected successfully');
//   })
//   .catch((error) => {
//     console.error('MongoDB connection error:', error);
//   });


// // Define encryption configuration
// const algorithm = 'aes-256-cbc';
// const secretKey = Buffer.from(process.env.SECRET_KEY, 'utf-8'); // Should be 32 bytes (256 bits)
// const iv = Buffer.from(process.env.IV, 'utf-8'); // Should be 16 bytes (128 bits)

// // Ensure the key and IV are the correct lengths
// if (secretKey.length !== 32 || iv.length !== 16) {
//   console.error('Error: SECRET_KEY must be 32 bytes and IV must be 16 bytes.');
//   process.exit(1);
// }

// // Encryption function
// const encrypt = (text) => {
//   const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
//   let encrypted = cipher.update(text, 'utf8', 'hex');
//   encrypted += cipher.final('hex'); // Ensures padding is handled automatically
//   return encrypted;
// };

// // Decryption function
// const decrypt = (encryptedText) => {
//   const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
//   let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
//   decrypted += decipher.final('utf8'); // Ensures padding is handled automatically
//   return decrypted;
// };

// // Define User Schema
// const UserSchema = new mongoose.Schema({
//   name: String,
//   password: String,
//   email: String,
//   phone: String,
//   profession: String,
// });

// const User = mongoose.model('User', UserSchema);

// // Register User Endpoint
// app.post('/api/register', async (req, res) => {
//   const { name, password, email, phone, profession } = req.body;

//   // Encrypt password
//   const encryptedPassword = encrypt(password);

//   const user = new User({
//     name,
//     password: encryptedPassword,
//     email,
//     phone,
//     profession,
//   });

//   try {
//     await user.save();
//     res.send('User registered successfully');
//   } catch (error) {
//     console.error('Error registering user:', error);
//     res.status(500).send('Server error');
//   }
// });

// // Login User Endpoint
// // Login User Endpoint
// // Login User Endpoint
// app.post('/api/login', async (req, res) => {
//     const { email, password } = req.body;
  
//     try {
//       // Find user by email
//       const user = await User.findOne({ email });
  
//       if (user) {
//         // Decrypt the stored password
//         const decryptedPassword = decrypt(user.password);
  
//         console.log('Decrypted Password:', decryptedPassword);
//         console.log('Input Password:', password);
  
//         // Compare decrypted password with input password
//         if (password === decryptedPassword) {
//           res.send('Login successful');
//         } else {
//           res.status(400).send('Invalid email or password');
//         }
//       } else {
//         res.status(400).send('Invalid email or password');
//       }
//     } catch (error) {
//       console.error('Error logging in user:', error);
//       res.status(500).send('Server error');
//     }
//   });
  
  

// console.log('Secret Key Length:', secretKey.length);
// console.log('IV Length:', iv.length);



// // Start Server
// app.listen(5000, () => console.log('Server started on port 5000'));
