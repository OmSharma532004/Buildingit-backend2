const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: { type: String, required: true},
  description: { type: String, required: true },
  prices: [{ cityId: { type: Schema.Types.ObjectId, ref: 'City' }, price: Number,pricePerPiece:Number }],
  categoryName: { type: Schema.Types.ObjectId, ref: 'Category',required:true }
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;
