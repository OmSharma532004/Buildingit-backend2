//login and signup backend controllers

const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const OTP = require('../models/OTP');
const Admin = require('../models/Admin');
const SuperAdmin = require('../models/SuperAdmin');




//signup controller

  module.exports.signup= async(req,res)=>{
    try{
        const {Name,email,password,phoneNo,otp}=req.body;
        console.log("Name",Name);
        if(!Name || !email || !password || !phoneNo ){
            return res.status(400).json({
                success:false,
                message:"Please enter all fields"
            })
        }
        //check if user already exists
        let user= await

        User.findOne({email});
        if(user){
            return res.status(400).json({
                success:false,
                message:"User already exists"
            })
    
        }
        const response = await OTP.find({ email }).sort({ createdAt: -1 }).limit(1)
    console.log(response)
    if (response.length === 0) {

      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    } else if (otp !== response[0].otp) {
     
      return res.status(400).json({
        success: false,
        message: "The OTP is not valid",
      })
    }
        const hashedPassword = await bcrypt.hash(password, 10);
        console.log(Name);

        user= new User({
            Name:Name,
            email,
            password:hashedPassword,
            phoneNo
        });
        await user.save();
        return res.status(200).json({
            success:true,
            message:"User registered successfully"
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "User cannot be registered. Please try again.",
          error:error
        })
      }
}
//signin controller
module.exports.signin= async(req,res)=>{
    try{
        const {email,password}=req.body;
        //check if user exists
        let user= await
        User.findOne({email});
        if(!user){
            return res.status(400).json({
                success:false,
                message:"User does not exist"
            })
    
        }
        //check if password is correct
        const validPassword= await bcrypt.compare(password,user.password);
        if(!validPassword){
            return res.status(400).json({
                success:false,
                message:"Invalid password"
            })
        }
        //generate token
        const token= jwt.sign({id:user._id},process.env.JWT_SECRET);
        return res.status(200).json({
            success:true,
            message:"User logged in successfully",
            user:user,
            token
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "User cannot be logged in. Please try again.",
          error:error
        })
      }
}

module.exports.logout=async(req,res)=>{
    try{
        return res.status(200).json({
            success:true,
            message:"User logged out successfully"
        })
    }
    catch (error) {
        console.error(error)
        return res.status(500).json({
          success: false,
          message: "User cannot be logged out. Please try again.",
          error:error
        })
      }
}

exports.sendotp = async (req, res) => {
    try {
      const { email } = req.body
  
  
    //   const checkUserPresent = await User.findOne({ email })
  
  
    //   if (checkUserPresent) {
    //     return res.status(401).json({
    //       success: false,
    //       message: `User is Already Registered`,
    //     })
    //   }
  
      var otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        lowerCaseAlphabets: false,
        specialChars: false,
      })
    //   const result = await OTP.findOne({ otp: otp })
    //   console.log("Result is Generate OTP Func")
    //   console.log("OTP", otp)
    //   console.log("Result", result)
    //   while (result) {
    //     otp = otpGenerator.generate(6, {
    //       upperCaseAlphabets: false,
    //     })
    //   }
      const otpPayload = { email, otp }
      const otpBody = await OTP.create(otpPayload)
      console.log("OTP Body", otpBody)
      res.status(200).json({
        success: true,
        message: `OTP Sent Successfully`,
        otp,
      })
    } catch (error) {
      console.log(error.message)
      return res.status(500).json({ success: false, error: error.message })
    }
  }


  exports.adminLogin = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const user = await Admin.findOne({
        email
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      if(password !== user.password){
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });

      res.status(200).json({ success: true, token,user });
    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  exports.adminSignup = async (req, res) => {
    try {
      const { name, email, password,phoneNo } = req.body;
      const admin = await Admin.create({
        name,
        email,
        password,
        phoneNo
      });
    
      bcrypt.hash(password, 10, (err, hash) => {
        if (err) {
          console.error(err);
          return res.status(500).json({ message: 'Internal Server Error' });
        }
        admin.password = hash;
      });

     
      res.status(201).json({  admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  exports.getAdminDetails = async (req, res) => {
    try {
      const user= req.params.id;
      const admin = await Admin.findById(user).populate();
      res.status(200).json({ admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  exports.superAdminLogin = async (req, res) => {
    try {
      const { name, password } = req.body;
  
      const user = await SuperAdmin.findOne({
        name
      });

      if (!user) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }
      //bcrypt compare password
      const validPassword= await bcrypt.compare(password,user.password);

      if(!validPassword){
          return res.status(400).json({
              success:false,
              message:"Invalid password"
          })
      }


      const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRE
      });

      user.token = token;


      const options = {
        expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      }
      res.cookie("token", token, options).status(200).json({
        success: true,
        token,
        user,
        message: `Admin Login Success`,
      })

    }
    catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }

  }

  exports.superAdminSignup = async (req, res) => {
    try {
      const { name, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const admin = await SuperAdmin.create({
        name,
        password: hashedPassword
      });
   
     
      res.status(201).json({  admin });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }



