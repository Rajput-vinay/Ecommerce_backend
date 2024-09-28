const mongoose = require('mongoose')
const { number } = require('zod')

const userSchema = new mongoose.Schema({
  userName:{
    type:String,
    required:true,

  },
  email:{
    type:String,
    unique:true,
    required:true
  },
  password:{
    type:String,
    required:true

  },
  contactNumber:{
    type: Number,
  } 
},{
    timestamps:true
})


const userModel = mongoose.model('User', userSchema)

module.exports={
    userModel
}