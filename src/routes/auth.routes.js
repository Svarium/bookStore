//Enrutador para manejar la autenticación de usuarios
const express = require("express");
const { register, login, getAllUsers, deleteUser, updateUserRole } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validateUserId, validateUpdateRole, validateSuperAdmin } = require("../middlewares/validator");
const { uploadProfile } = require("../config/multer");

const router = express.Router();
//Llego con /auth/ - esta es la ruta raíz de este enrutador

router.post("/register", uploadProfile, validateRegister, register);
router.get("/users/:id", validateSuperAdmin, getAllUsers);
router.post("/login", validateLogin, login);
router.patch("/user/:id", validateUserId, validateUpdateRole, updateUserRole)
router.delete("/user/:id", validateUserId, deleteUser); //Ruta parametrizada


module.exports = router;