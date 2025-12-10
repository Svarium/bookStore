//CONEXIÓN A LA BASE DE DATOS

//PASO 1: Requerir mongoose
const mongoose = require("mongoose");

//Paso 2: Crear una función que hace la conexión
const connectDB = async () => {
   try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('🌎 MongoDB Conectado Exitosamente!!!!');        
   } catch (error) {
    console.error('❌ Error al conectar con MongoDB', error.message);
    process.exit(1);
   }
}

//Paso 3: Exportar la función
module.exports = connectDB;