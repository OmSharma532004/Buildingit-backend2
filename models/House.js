//create mongoose schema of House
const mongoose = require('mongoose');

const HouseSchema = new mongoose.Schema({
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
    rawMaterials: {
        //array of objects with ref material
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Material'

    },
    size: {
        type: Number,
        required: true
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

const House = mongoose.model('House', HouseSchema);
module.exports = House;