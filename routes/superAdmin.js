const express = require('express');
const { superAdminSignup, superAdminLogin } = require('../controllers/auth');

const router = express.Router();


router.post('/superAdmin/signup',superAdminSignup);
router.post('/superAdmin/login',superAdminLogin);




module.exports = router;