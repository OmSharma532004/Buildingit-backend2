const express = require('express');
const router = express.Router();
const sendMail = require('../controllers/sendMail');
const sendConstructionDetails = require('../controllers/sendMail');

router.post('/sendmail', sendMail);
router.post('/send-construction-details', sendConstructionDetails);





module.exports = router;
