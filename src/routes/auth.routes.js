//Enrutador para manejar la autenticación de usuarios
const express = require("express");
const { register, login, getAllUsers, deleteUser, updateUserRole } = require("../controllers/auth.controller");
const { validateRegister } = require("../middlewares/auth.validator");

const router = express.Router();
//Llego con /auth/ - esta es la ruta raíz de este enrutador

router.post("/register", validateRegister, register);
router.get("/users", getAllUsers);
router.post("/login", login);
router.patch("/user/:id", updateUserRole)
router.delete("/user/:id", deleteUser); //Ruta parametrizada


module.exports = router;