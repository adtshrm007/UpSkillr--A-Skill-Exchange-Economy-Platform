import mongoose from "mongoose";

const lessons=new mongoose.Schema({
    
},{timestamps:true})

const coursesSchema=new mongoose.Schema({
    instructor:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
    },

},{timestamps:true})