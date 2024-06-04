const fs = require('fs');
const { File } = require('../models/File');
const mongoose = require('mongoose');

const uploadFile = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const filePath = __dirname + '/../uploads/' + file.name;
  let user=req.body.user;
  user = user.replace(/['"]+/g, '');
  const userId = new mongoose.Types.ObjectId(user);

  file.mv(filePath, async (err) => {
    if (err) return res.status(500).send(err);

    try {
      const newFile = new File({ name: file.name, path: filePath ,uploadedBy:userId});
      await newFile.save();
      res.send('File uploaded and saved to database!');
    } catch (error) {
        console.log(error);
      res.status(500).json({ error: error  , message: 'Failed to save file to database'});
    }
  });
};

const getFiles = async (req, res) => {
  try {
    const files = await File.find();
    res.json(files);
  } catch (error) {
    res.status(500).send('Error fetching files');
  }
};

const approveFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById(fileId);
    if (file) {
      file.approved = 'approved';
      await file.save();
      res.send('File approved!');
    } else {
      res.status(404).send('File not found');
    }
  } catch (error) {
    res.status(500).send('Error approving file');
  }
};

const getFilesByUserId=async(req,res)=>{
  let user=req.params.userId;

  user = user.replace(/['"]+/g, '');
  const userId = new mongoose.Types.ObjectId(user);

  console.log(userId);
  try {
    const files = await File.find({uploadedBy:userId});
    res.json(files);
  } catch (error) {
    res.status(500).send('Error fetching files');
  }
}
const rejectFile=async(req,res)=>{
  const fileId = req.params.id;

  try {
    const file = await File.findById
    (fileId);
    if (file) {
      file.approved = 'rejected';
      await file.save();
      res.send('File rejected!');
    } else {
      res.status(404).send('File not found');
    }
  }
  catch (error) {
    res.status(500).send('Error rejecting file');
  }
}

const deleteFile = async (req, res) => {
  const fileId = req.params.id;

  try {
    const file = await File.findById
    (fileId);
    if(file){
      //remove frome database
      await File.deleteOne({ _id: fileId });
      //remove from storage
      // fs.unlinkSync(file.path);
      res.send('File deleted!');

    }
  }
  catch (error) {
    res.status(500).send('Error deleting file');
    console.log(error);
  }
}



module.exports = {
  uploadFile,
  getFiles,
  approveFile,
  getFilesByUserId,
  rejectFile,
  deleteFile
};
