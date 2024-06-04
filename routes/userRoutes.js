// userRoutes.js
const express = require('express');
const { createUser, googleSignIn, signIn, getUserProfile, updateUserProfile, GoogleLogout } = require('../controllers/userController'); // Adjust the path as needed

const router = express.Router();

router.post('/user/signup', createUser);
router.post('/google-signin', googleSignIn);
router.get('/getUser/:id', getUserProfile);
router.put('/editUser/:id', updateUserProfile);
router.post('/google-logout', GoogleLogout);

module.exports = router;
