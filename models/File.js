const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { type: String, required: true },
  path: { type: String, required: true },
  approved: { type:String , default: "pending", enum: ['approved', 'pending','rejected']},
  uploadedAt: { type: Date, default: Date.now },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
});

const File = mongoose.model('File', fileSchema);

module.exports = { File };
