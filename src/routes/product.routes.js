//enrutador para manejar los endpoints de productos
const express = require("express");

const router = express.Router();

// Llego con /products - esa es la ruta raíz

// --> RUTAS PUBLICAS PARA TODOS LOS USUARIOS 
//router.get('/', )
//router.get('/search', )
//router.get('/:id', )

// --> RUTAS PRIVADAS (SOLO ADMIN Y SUPER ADMIN)
//router.post('/', )
//router.put('/:id', )
//router.delete('/:id', )


module.exports = router;
