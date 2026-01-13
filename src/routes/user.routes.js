//Enrutador para manejar los endpoints de usuario
const express = require("express");
const { verifyAuth, verifyAdmin } = require("../middlewares/auth");
const { getAllUsers, updateUserRole, deleteUser, getUserById } = require("../controllers/user.controller");
const { validateMongoID, validateUpdateRole, validateUserId } = require("../middlewares/validator");

const router = express.Router();
//Llego con /users/ - esta es la ruta raíz de este enrutador

// TODAS LAS RUTAS REQUIEREN AUTENTICACION Y PERMISOS DE ADMIN
router.use(verifyAuth, verifyAdmin); // yo le indico al enrutador que por defecto use mis middlewares de validación de roles.

//RUTAS PRIVADAS PARA ADMINISTRACIÓN DE USUARIOS
router.get('/', getAllUsers);
//GET USER BY ID
router.get('/:id', validateUserId, getUserById)
router.patch('/:id/role', validateMongoID, validateUpdateRole, updateUserRole);
router.delete('/:id',validateMongoID, deleteUser);


module.exports = router;