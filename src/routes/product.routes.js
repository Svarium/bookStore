//enrutador para manejar los endpoints de productos
const express = require("express");
const { uploadProductImages } = require("../config/multer");
const { validateProduct, validateMongoID, validateUpdateProduct } = require("../middlewares/validator");
const { createProduct, getAllProducts, updateProduct } = require("../controllers/product.controller");
const { verifyAuth, verifyAdmin } = require("../middlewares/auth");

const router = express.Router();

// Llego con /products - esa es la ruta raíz

// --> RUTAS PUBLICAS PARA TODOS LOS USUARIOS 
router.get('/', getAllProducts)
//router.get('/search', )
//router.get('/:id', )

// --> RUTAS PRIVADAS (SOLO ADMIN Y SUPER ADMIN)
router.post(
    '/', 
    verifyAuth,
    verifyAdmin,
    uploadProductImages, 
    validateProduct, 
    createProduct);

router.put(
    '/:id',
    verifyAuth,
    verifyAdmin,
    validateMongoID,
    uploadProductImages,
    validateUpdateProduct,
    updateProduct
)

//router.delete('/:id', )


module.exports = router;
