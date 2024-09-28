const mongoose = require('mongoose')
const { number } = require('zod')

const adminSchema = new mongoose.Schema({
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


const adminModel = mongoose.model('Admin', adminSchema)

module.exports={
    adminModel
}