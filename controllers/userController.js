// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex');
}

function generateRandomPhoneNumber() {
  const randomPhoneNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
  return randomPhoneNumber.toString();
}

exports.createUser = async (req, res) => {
  try {
    const { name, password, email, phoneNo, approvedHouses } = req.body;

    let user = new User({
      name,
      password,
      email,
      phoneNo,
      approvedHouses,
    });

    user = await user.save();

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(201).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.googleSignIn = async (req, res) => {
  const { googleId, email, name, imageUrl, tokenId } = req.body;

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        googleId,
        email,
        Name: name || "Default Name", // Provide a fallback name
        imageUrl,
        password: generateRandomPassword(),
        phoneNo: generateRandomPhoneNumber(),
        approvedHouses: null
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign({ userId: user._id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token, user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
      const user = await User.findById(req.params.id);
      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

// Update user profile
exports.updateUserProfile = async (req, res) => {
  const { name, email, phoneNo } = req.body;

  // Build user object
  const userFields = {};
  if (name) userFields.name = name;
  if (email) userFields.email = email;
  if (phoneNo) userFields.phoneNo = phoneNo;

  try {
      let user = await User.findById(req.params.id);

      if (!user) {
          return res.status(404).json({ msg: 'User not found' });
      }

      user = await User.findByIdAndUpdate(
          req.params.id,
        {
          Name: userFields.name,
          email: userFields.email,
          phoneNo: userFields.phoneNo,

        }
      );
      
      res.json(user);
  } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
  }
};

const { OAuth2Client } = require('google-auth-library');

const CLIENT_ID = '646102159744-39spi62n4lc3orsasooie7je0uka1hc9.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);

exports.GoogleLogout = async (req, res) => {
  const { tokenId } = req.body;

  console.log('Received tokenId:', tokenId);

  try {
      const ticket = await client.verifyIdToken({
          idToken: tokenId,
          audience: CLIENT_ID,
      });

      const payload = ticket.getPayload();
      const userId = payload['sub'];

      console.log('User ID:', userId);

      // Invalidate the session or perform any necessary logout steps
      req.session.destroy((err) => {
          if (err) {
              console.error('Session destruction error:', err);
              return res.status(500).send({ error: 'Failed to log out', details: err });
          }
          res.clearCookie('connect.sid', { path: '/' });
          res.status(200).send('Logout successful');
      });
  } catch (error) {
      console.error('Error during token verification:', error);
      res.status(500).send({ error: 'Failed to verify token', details: error });
  }
};