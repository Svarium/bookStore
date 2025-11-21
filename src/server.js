const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
//IMPORTAR LAS RUTAS
const productRoutes = require("./routes/productRoutes");

const app = express();

//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true})); //PARA QUE EXPRESS PUEDA LEER LOS DATOS DE FORMULARIOS

//ROUTES
app.use("/api/v1/products", productRoutes);

//PUERTO
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

