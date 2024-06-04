const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const citySchema = new Schema({
  name: { type: String, required: true, unique: true },
  categories: [{ type: Schema.Types.ObjectId, ref: 'Category' }]
});

const City = mongoose.model('City', citySchema);

module.exports = City;