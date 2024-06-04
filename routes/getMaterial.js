const express = require('express');
const { getMaterial, getPerPeicePrice } = require('../controllers/getMaterial');
const router = express.Router();

router.get('/getMaterial/:city', getMaterial);
router.post('/getPerPiece', getPerPeicePrice);



module.exports = router;