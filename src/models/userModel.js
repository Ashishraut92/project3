
const mongoose=require("mongoose")


const userSchema= new mongoose.Schema({

    title: {type:String, require:true, enum:["Mr", "Mrs", "Miss"]},
    
    name: {type:String, require:true},
    phone: {type:String, require:true, unique:true},
    email : {
        type : String,
        trim : true,
        unique: true,
        required : true,
        lowercase : true,
        match : [/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/, 'Please fill a valid email address']
    },

    password: {
        required:true,
        type:String,
        minlength: 8,
        maxlength: 15,
        trim: true
    },

    address: {
        street: {
            type:String,
            trim:true
        },
        city: {
            type:String,
            trim:true
        },
        pincode: {
            type:String,
            trim:true
        },
      },



}, { timestamps: true });   
   
module.exports = mongoose.model('user', userSchema)

    