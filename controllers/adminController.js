
const User = require('../models/userModel');
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');


const config = require('../config/config');

const randomstring = require('randomstring');


// s password 
const securePassword = async(password)=>{
    try{
         const passwordHash = await bcrypt.hash(password, 10);
         return passwordHash;
     }catch(error){
         console.log(error.message)
     }
}

// 
const sendResetPasswordMail = async(name, email, token)=>{

    try{
        const transporter =  nodemailer.createTransport({
            host:'smtp.gmail.com',
            port:587,
            secure:false,
            auth:{
                user:config.emailUser,
                pass:config.emailPassword
            }
         });
        const mailOption = {
            from:config.emailUser,
            to:email,
            subject:'For Reset Password',
            html:'<p> hi '+name+', Please click here to <a href="http://localhost:3000/admin/forget-password?token='+token+'">Reset</a> Your Password.</p>',
        };
            transporter.sendMail(mailOption, function(error, info){
                if(error){
                    console.log(error);
                }else{
                    console.log("email has been sent:-",info.response);
                }
            })
     
     }catch(error){
         console.log(error.message)
     }
}


const loadLogin = async(req, res)=>{
    try {
        
        res.render('login');
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async(req, res)=>{
    try {
       const email = req.body.email;
       const password = req.body.password;

      const userData = await User.findOne({email:email});

      if(userData){
      const passwordMatch = await  bcrypt.compare(password,userData.password);

      if(passwordMatch){

        // check admin or not
        if(userData.is_admin === 0){
            res.render('login',{message:"Email and Password is incorrect."});
        }else{
            req.session.user_id = userData._id;
            // send admin home
            res.redirect('/admin/home');
        }

      }else{
        res.render('login',{message:"Email and Password is incorrect."});
      }



      }else{
        res.render('login',{message:"Email and Password is incorrect."});
      }



    } catch (error) {
        console.log(error.message);
    }
}




// dashbord
const  loadDashboard = async(req, res)=>{
    try {
        const userData = await User.findById({_id:req.session.user_id});
        // user for home page 
        // res.render('home',{user:userData});
        res.json(userData);
        
    } catch (error) {
        console.log(error.message);
    }
}


const loadlogout = async(req, res)=>{
    try {
       req.session.destroy();
       res.redirect('/admin');
    
    } catch (error) {
        console.log(error.message);
    }
}
const forgetLoad = async(req, res)=>{
    try {
       res.render('forget');
    
    } catch (error) {
        console.log(error.message);
    }
}

const forgetVerify = async(req, res)=>{
    try {
        const email = req.body.email;
        const userdata =  await User.findOne({email: email});
       if(userdata){
        if (userdata.is_admin === 0) {
            res.render('forget',{message:"Email is incorrect."});
        }else{
         const randomString = randomstring.generate();
         const updatedData = await User.updateOne({email:email},{$set:{token:randomString}});
        // sent mail
        sendResetPasswordMail(userdata.name,userdata.email,randomString);
        res.render('forget',{message:"Please check your email to reset your password."});
    }
            
       }
       else{
        res.render('forget',{message:"Email incorrect."});
       }
    
    } catch (error) {
        console.log(error.message);
    }
}

const forgetPasswordLoad = async(req, res)=>{
    try {
        // get token from sendforgetpasswordemain
        const token = req.query.token;
        const tokenData = await User.findOne({token:token});
        if(tokenData){
            res.render('forget-password',{user_id:tokenData._id});
        }else{
            res.render('404',{message:"Token in invalid."});
        }

    } catch (error) {
        console.log(error.message);
    }
}




// resetPassword
const resetPassword = async(req, res)=>{
    try {
        const password = req.body.password;
        const user_id = req.body.user_id;
        const secure_password = await securePassword(password);

     const updateData = await  User.findByIdAndUpdate({_id:user_id},{$set:{password:secure_password,token:''}})
       
     res.redirect('/admin');
    } catch (error) {
        console.log(error.message);
    }
    
}

// for verification sent link
const verificationLoad = async(req, res)=>{
    try {
        res.render('verification');
    
    } catch (error) {
        console.log(error.message);
    }
}

// user profile edit 
const editLoad = async(req, res)=>{

    try {
        const id = req.query.id;
        const userData = await User.findById({_id:id});
        if(userData){
            res.render('edit',{user:userData});
        }else{
            res.redirect('/admin/home');
        }

    } catch (error) {
        console.log(error.message);
    }
}

const updateProfile = async(req, res)=>{

    try {
  
        if(req.file){
            const userData=  await  User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile, image:req.file.filename}});
        }else{
         const userData=  await  User.findByIdAndUpdate({_id:req.body.user_id},{$set:{name:req.body.name, email:req.body.email, mobile:req.body.mobile}});
        }
        
        res.redirect('home');
    } catch (error) {
        console.log(error.message);
    }
}


module.exports = {
    loadLogin,
    verifyLogin,
    loadDashboard,
    loadlogout,
    forgetLoad,
    forgetVerify,
    forgetPasswordLoad,
    resetPassword,
    verificationLoad,
    editLoad,
    updateProfile

}
