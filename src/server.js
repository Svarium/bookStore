const express = require("express");
require("dotenv").config();
const morgan = require("morgan");

//IMPORTAR LOS ARCHIVOS DE LOS ENRUTADORES
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const favsRoutes = require("./routes/favorites.routes");
const usersRoutes = require("./routes/user.routes");
const connectDB = require("./config/database");

const app = express();

//Conexión a la base de datos
connectDB()


//MIDDLEWARES
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: true})); //PARA QUE EXPRESS PUEDA LEER LOS DATOS DE FORMULARIOS

// UTILIZO LOS ENRUTADORES
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/favs", favsRoutes);
app.use("/api/v1/users", usersRoutes);

//PUERTO
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

