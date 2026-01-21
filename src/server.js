const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require('path');
const cookieParser = require("cookie-parser");

//IMPORTAR LOS ARCHIVOS DE LOS ENRUTADORES
const productRoutes = require("./routes/product.routes");
const authRoutes = require("./routes/auth.routes");
const cartRoutes = require("./routes/cart.routes");
const favsRoutes = require("./routes/favorites.routes");
const usersRoutes = require("./routes/user.routes");
const connectDB = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const createSuperAdmin = require("./utils/createSuperAdmin");
const {globalLimiter} = require("./middlewares/rateLimiter");

const app = express();

//Conexión a la base de datos
connectDB()

//Llamo a la función que crea al superadmin
createSuperAdmin();


//MIDDLEWARES
app.use(morgan("dev"));
app.use(globalLimiter);
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true})); //PARA QUE EXPRESS PUEDA LEER LOS DATOS DE FORMULARIOS


//Servir archivos estáticos (imágenes u otros archivos)
app.use('/uploads', express.static(path.join(__dirname, '../uploads')))

// UTILIZO LOS ENRUTADORES
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/cart", cartRoutes);
app.use("/api/v1/favs", favsRoutes);
app.use("/api/v1/users", usersRoutes);


//Acá llamo al middleware manejador de errores
app.use(errorHandler)

//PUERTO
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
})

