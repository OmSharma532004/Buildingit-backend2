const express = require('express');
const { sendMail, sendConstructionDetails } = require('../controllers/sendMail');
const router = express.Router();


router.post('/sendmail', sendMail);
router.post('/send-construction-details', sendConstructionDetails);





module.exports = router;
