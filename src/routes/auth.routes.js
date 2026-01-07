//Enrutador para manejar la autenticación de usuarios
const express = require("express");
const { register, login, getAllUsers, deleteUser, updateUserRole, verifyEmail, logout, getUserProfile, updateProfilePhoto } = require("../controllers/auth.controller");
const { validateRegister, validateLogin, validateUserId, validateUpdateRole, validateSuperAdmin, validateVerifyEmail } = require("../middlewares/validator");
const { uploadProfile } = require("../config/multer");
const { verifyAuth } = require("../middlewares/auth");

const router = express.Router();
//Llego con /auth/ - esta es la ruta raíz de este enrutador

//ENDPOINTS PUBLICOS
router.post("/register", uploadProfile, validateRegister, register);
router.post("/verify-email", validateVerifyEmail, verifyEmail);
router.post("/login", validateLogin, login);

//ENDPOINTS PRIVADOS
router.post("/logout",verifyAuth, logout);
router.get("/profile",verifyAuth, getUserProfile);
router.put("/profile/photo", verifyAuth, uploadProfile, updateProfilePhoto)



/* router.patch("/user/:id", validateUserId, validateUpdateRole, updateUserRole)
router.get("/users/:id", validateSuperAdmin, getAllUsers);
router.delete("/user/:id", validateUserId, deleteUser);  */


module.exports = router;