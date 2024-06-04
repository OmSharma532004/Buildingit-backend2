// authRoutes.js

const express = require('express');
const router = express.Router();
const { signup, signin ,sendotp, adminLogin, adminSignup, getAdminDetails} = require('../controllers/auth'); // Import signup and signin controllers
const passport = require('passport');
const { resetPasswordToken, resetPassword } = require('../controllers/resetPassword');


router.post('/admin/login',adminLogin);
router.post('/admin/signup',adminSignup);

router.get('/admin/:id',getAdminDetails);

router.get('/login/success',(req,res)=>{
    if(req.user){
        res.status(200).json({
            error:false,
            message:'login successfully!',
            user:req.user,
        })
    }else{
        res.status(300).json({error:true,message:'not authorized!'});
    }
})

router.get('/login/failed',(req,res)=>{
    res.status(401).json({
        error:true,
        message:'log in failure',
    })
})

// Signup route
router.post('/signup', signup);


// Signin route
router.post('/signin', signin);
//sendotp
router.post('/sendotp', sendotp);

router.get(
    "/google/callback",
    passport.authenticate("google",{
        successRedirect:process.env.CLIENT_ID,
        failureRedirect:'/login/failed',
    })
)

router.get('/google',passport.authenticate("google",["profile",'email']));
router.get('/logout',(req,res)=>{
    req.logout();
    res.redirect(process.env.CLIENT_URL);
});

router.post("/reset-password-token", resetPasswordToken)

router.post("/reset-password", resetPassword)



module.exports = router;
