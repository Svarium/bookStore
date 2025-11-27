//Enrutador para manejar la autenticación de usuarios
const express = require("express");
const { register, login, getAllUsers, deleteUser } = require("../controllers/auth.controller");

const router = express.Router();
//Llego con /auth/ - esta es la ruta raíz de este enrutador

router.get("/users", getAllUsers);
router.post("/register", register);
router.post("/login", login);
router.delete("/user/:id", deleteUser); //Ruta parametrizada


module.exports = router;