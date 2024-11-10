const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const crypto = require('crypto');
require('dotenv').config();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/UserDetails')
  .then(() => console.log('MongoDB connected successfully'))
  .catch(error => console.error('MongoDB connection error:', error));

// Encryption configuration
const algorithm = 'aes-256-cbc';
const secretKey = Buffer.from(process.env.SECRET_KEY, 'utf-8'); 
const iv = Buffer.from(process.env.IV, 'utf-8'); 

// Validate key lengths
if (secretKey.length !== 32 || iv.length !== 16) {
  console.error('Error: SECRET_KEY must be 32 bytes and IV must be 16 bytes.');
  process.exit(1);
}

// Encryption function
const encrypt = (text) => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};

// Decryption function
const decrypt = (encryptedText) => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, iv);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  phone: String,
  profession: String,
});

const User = mongoose.model('User', UserSchema);

// Register new user
app.post('/api/register', async (req, res) => {
  const { name, password, email, phone, profession } = req.body;

  const encryptedPassword = encrypt(password);

  const user = new User({
    name,
    password: encryptedPassword,
    email,
    phone,
    profession,
  });

  try {
    await user.save();
    res.send('User registered successfully');
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Server error');
  }
});

// Login user
app.post('/api/login', async (req, res) => {
  const { email, password } = req.body;

  try {                                  
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).send('Invalid email or password');
    }

    const decryptedPassword = decrypt(user.password);
    if (decryptedPassword === password) {
      res.send('Login successful');
    } else {
      res.status(404).send('Invalid email or password');
    }
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).send('Server error');
  }
});

// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).send('Server error');
  }
});

// Update user data
app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const { name, password, email, phone, profession } = req.body;

  try {
    const user = await User.findById(id);
    if (user) {
      user.name = name || user.name;
      user.password = password ? encrypt(password) : user.password;
      user.email = email || user.email;
      user.phone = phone || user.phone;
      user.profession = profession || user.profession;
      await user.save();
      res.send('User updated successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).send('Server error');
  }
});

// Delete user
app.delete('/api/users/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByIdAndDelete(id);
    if (user) {
      res.send('User deleted successfully');
    } else {
      res.status(404).send('User not found');
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).send('Server error');
  }
});

// Start Server
app.listen(5000, () => console.log('Server started on port 5000'));
