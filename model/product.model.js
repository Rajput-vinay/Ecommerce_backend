const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true,
    },
    description:{
        type:String,
        required:true,
    },
    price:{
        type:Number,
        required:true
    },
    category:{
        type:String
    },
    stock:{
        type:Number,
        required:true,
    },
    imageUrl:{
        type:String,
    },
    creatorId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'admin',
        required:true
    }
},{timestamps:true})


const productModel = mongoose.model('Product', productSchema)
module.exports={
    productModel
}