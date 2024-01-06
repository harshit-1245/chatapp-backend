const mongoose=require('mongoose');
require('dotenv').config();
const colors=require('colors')

const connectDB=async()=>{
    try {
        const conn=await mongoose.connect(process.env.MONGO_URL,{
            useNewUrlParser:true,
            useUnifiedTopology:true,
        })
        console.log(`MongoDB connected: ${conn.connection.host}`.green.bold);
    } catch (error) {
       console.log(`Error: ${error.message}`)
       process.exit();
    }
}
module.exports= connectDB;