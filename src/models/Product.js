const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    title:{
        type:String,
        required:true,
        trim: true
    },
    author:{
        type:String,
        required:true,
        trim: true
    },
    price:{
        type: Number,
        required:true,
        min:0
    },
    description:{
        type:String,
        required:true,
        trim: true
    },
    genre:{
        type:String,
        required:true,
        enum: ['fantasia', 'policial', 'manga', 'cientifico', 'novela', 'terror', 'otros'],       
        trim: true
    },
    publisher:{
        type:String,
        required:true,
        trim: true
    },
    stock:{
        type: Number,
        required:true,
        min:0,
        default:0
    },
    images: [
        {
            type:String,
            required:true
        }
    ]
},{
    timestamps:true
});





module.exports = mongoose.model('Product', productSchema);