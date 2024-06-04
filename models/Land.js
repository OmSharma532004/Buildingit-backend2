//mongoose schema of land

const mongoose = require('mongoose');
const LandSchema = new mongoose.Schema({
    location: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    ConstructionArea: {
        type: Number,
        required: true
    },
    totalSize: {
        type: Number,
        required: true
    },
    approved: {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const Land = mongoose.model('Land', LandSchema);

module.exports = Land;