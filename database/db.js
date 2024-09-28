const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config()
const dbConnect = async () =>{
    try {
        const mongooseConnect = await mongoose.connect(process.env.MONGO_DB)
        console.log(`mongodb connect successfully ${mongooseConnect}`)
    } catch (error) {
        console.log(error.message)        
    }
}

module.exports = {
    dbConnect
}