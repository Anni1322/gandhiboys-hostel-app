const express = require('express');
const  admin_route = express();

const session = require('express-session');
const config = require('../config/config');
admin_route.use(session({
secret:config.sessionSecret,
  resave: false,  
    saveUninitialized: false,
}));

const bodyParser = require('body-parser');
admin_route.use(bodyParser.json());
admin_route.use(bodyParser.urlencoded({extended:true}));

// for image upload
const multer = require("multer");
const path = require('path');

admin_route.use(express.static('public'));

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null,path.join(__dirname, '../public/userimages'))
    },
    filename:function (req, file, cb) {
        const name = Date.now()+'-'+file.originalname;
        cb(null,name);
    }
})
const upload = multer({storage:storage});

admin_route.set('view engine','ejs');
admin_route.set('views','./views/admin');

const auth = require('../middleware/adminAuth');


// controller for all function
const adminController = require('../controllers/adminController');



admin_route.get('/',auth.islogout,adminController.loadLogin);



admin_route.post('/',adminController.verifyLogin);

admin_route.get('/home',auth.islogin,adminController.loadDashboard);
admin_route.get('/logout',auth.islogin,adminController.loadlogout);

admin_route.get('/forget',auth.islogout,adminController.forgetLoad);

admin_route.post('/forget',auth.islogout,adminController.forgetVerify);
admin_route.get('/forget-password',adminController.forgetPasswordLoad);
admin_route.post('/forget-password',adminController.resetPassword);


admin_route.get('/edit',auth.islogin,adminController.editLoad);
admin_route.post('/edit',upload.single('image'),adminController.updateProfile);


admin_route.get('*',function(req, res){

    res.redirect('/admin');
});

module.exports = admin_route;