const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile:{
        type:Number,
        required:true
    },
    image:String,
    password:{
        type:String,
        required:true
    },
    department:{
        type:String,
        required:true
    },
    batch:{
        type:Number,
        required:true
    },
    age:{
        type:Number,
        required:true
    },
    room:{
        type:Number,
        required:true
    },
    position:{
        type:String,
        required:true
    },
    address:{
        type:String,
        required:true
    },
    qualification:{
        type:String,
        required:true
    },
    username:{
        type:String,
        required:true
    },

    is_admin:{
        type:Number,
        required:true
    },
    is_verified:{
        type:Number,
        default:0
    },
    token:{
        type:String,
        default:''
    },
});

module.exports =  mongoose.model('User',userSchema);