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

// Validación: mínimo me pida 1 imagen, máximo 3.
productSchema.path('images').validate(function(value){
    return value.length >= 1 && value.lengt <= 3;
}, 'Debe haber entre 1 y 3 imágenes');



module.exports = mongoose.model('Product', productSchema);