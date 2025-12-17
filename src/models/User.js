//Este va a ser el modelo de usuarios. 
//Paso 1 - requerir mongoose
const mongoose = require("mongoose");

//Paso 2 - Vamos a crear el esquema del usuario
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required:true,
        unique: true
    },
    profilePic:{
        type: String,
        default: "https://www.iconpacks.net/icons/2/free-user-icon-3296-thumb.png"
    },
    password:{
        type: String,
        required:true
    },
    role:{
        type: String,
        enum: ['user', 'admin', 'superadmin'],
        default: 'user'
    },
},{
   timestamps:true 
});

//Paso 3 - Exportar el modelo del usuario (con mongoose.model que requiere dos parámetros: 1- Alias | 2-- Schema )
module.exports = mongoose.model("User", userSchema);