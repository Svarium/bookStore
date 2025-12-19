const { body, param, validationResult } = require("express-validator");
const User = require("../models/User");
const { deleteOneFile } = require("../utils/fileCleanup");
const ROLE_SUPERADMIN = "superadmin"

//middlware para manejar los errores de validacion
const handleValidationsErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      ok: false,
      message: "Errores de validación",
      errors: errors.mapped(),
    });
  }

  next();
};

const handleValidationsErrorsWithFiles = (req, res, next) => {
  const errors = validationResult(req);

  if(!errors.isEmpty()){
    //si hay errores y si se subio archivo, necesito eliminarlo
    if(req.file){
      deleteOneFile(req.file.path)
    }

    return res.status(400).json({
      ok: false,
      message: "Errores de validación",
      errors: errors.mapped(),
    });
  }

  next()
}

//Validaciones para el registro de un usuario
const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

    body("surname")
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isString()
    .withMessage("El apellido debe ser un texto")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),

  body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (user) {      
        throw new Error("El usuario ya existe");
      }
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("la contraseña debe tener por lo menos 6 caracteres"),

    handleValidationsErrorsWithFiles,
];

//Validación del login
const validateLogin = [
  body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email ingresado debe ser válido")
    .normalizeEmail()
    .custom(async (email) => {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error("Credencial incorrecta");
      }
    }),

  body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("La contraseña debe tener al menos 6 carácteres")
    .custom(async (password) => {
      const user = await User.findOne({ password });
      if (!user) {
        throw new Error("Credencial incorrecta");
      }
    }),
  handleValidationsErrors,
];

//Validación de ID de usuario (Delete y Actualizar Rol)
const validateUserId = [
    param('id')
        .isMongoId().withMessage("El ID proporcionado no es válido")
        .custom(async (id) => {
            const user = await User.findById(id);
            if(!user)
            {
                throw new Error("El usuario no existe o no fue encontrado")
            }
        }),

    handleValidationsErrors
    
]

const validateUpdateRole = [
    body('role')
        .notEmpty().withMessage('Debe proporcionar el rol del usuario')
        .isIn(['user', 'admin', 'superadmin']).withMessage('El rol debe ser: user, admin o superadmin'),
    
    handleValidationsErrors
];

const validateSuperAdmin = [
  param("id")
    .isMongoId()
    .withMessage("El ID proporcionado no es válido")
    .custom(async (id) => {
      const user = await User.findById(id);
      if (user.role !== ROLE_SUPERADMIN) {
        throw new Error("El usuario no tiene permisos para esta acción");
      }
    }),

    handleValidationsErrors
];

module.exports = {
  validateRegister,
  validateLogin,
  validateUserId,
  validateUpdateRole,
  validateSuperAdmin
};
