const core = require('cors')
const express = require('express');
const user_route = express();
const session = require('express-session');
const fs = require('fs');

 


// for session 
const config = require('../config/config');
user_route.use(session({
secret:config.sessionSecret,  
resave: false,  
saveUninitialized: false,
}));



// for auth
const auth = require('../middleware/auth');

// for view
user_route.set('view engine','ejs');
user_route.set('views','./views/users');

// for get data  from body
const bodyParser = require('body-parser');
user_route.use(bodyParser.json());
user_route.use(bodyParser.urlencoded({extended:true}))
user_route.use(core());

// for image upload
const multer = require("multer");
const sharp = require('sharp');
const path = require('path');
const { resizeAndSaveImage } = require('../middleware/resizer');

// user_route.use(express.static('public'));
// user_route.use(express.static(path.join(__dirname, 'public')));


// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//         // cb(null,path.join(__dirname, '../public/userimages'))
//         cb(null,'./public');
//     },
//     filename:function (req, file, cb) {
//         const name = Date.now()+'-'+file.originalname;
//         cb(null,name);
//     }
// })


var storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,'./public');
    },
    filename: function(req, file, cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    }
});

var upload = multer({
    storage: storage,
    limits: {
        fileSize: 3 * 1024 * 1024 
    }
}).single('image');




// controller for all function
const userController = require('../controllers/userController');


user_route.get('/register',auth.isLogout,userController.loadRegister);
user_route.get('/users',auth.isLogout,userController.loaduploadd);

// user_route.post('/register',upload.single('image'),userController.insertUser);
// user_route.post('/upload',upload.single('image'),userController.uploadd);

user_route.post('/register',upload,userController.insertUser);
user_route.post('/upload',upload,userController.uploadd);

user_route.get('/verify',userController.verifymail);
// user_route.get('/loginverify',userController.verifyLogin);
user_route.get('/',auth.isLogout, userController.loginload);
user_route.get('/login',auth.isLogout, userController.loginload);
user_route.post('/login',userController.verifyLogin);

// user_route.get('/home',auth.isLogin, userController.loadHome);
user_route.get('/home', userController.loadHome);


user_route.get('/department',userController.loadAddDepartment);
// user_route.post('/add_department',adminController.adddepartment);

user_route.get('/logout',auth.isLogin,userController.userlogout);

user_route.get('/forget',auth.isLogout,userController.forgetLoad);

user_route.post('/forget',userController.fogetVerify);

user_route.get('/forget-password',auth.isLogout,userController.fogetPasswordLoad);
user_route.post('/forget-password',userController.resetPassword);

user_route.get('/verification',userController.verificationLoad);
user_route.post('/verification',userController.sentverificationLink);


user_route.get('/edit',auth.isLogin,userController.editLoad);
// user_route.post('/edit',upload.single('image'),userController.updateProfile);
user_route.post('/edit',upload,userController.updateProfile);



module.exports = user_route;