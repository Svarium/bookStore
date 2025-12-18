

//Middleware para manejar los errros

const { cleanUploadsFiles } = require("../utils/fileCleanup");

const errorHandler = (err, req, res, next) => {

    console.error('⛔ Error: ', err)

    //Limpiar archivos subidos si hay error
    cleanUploadsFiles(req)

    //Error de validacion de Mongoose
    if(err.name === 'ValidationError'){
        const errors = Object.values(err.errors).map(e => e.message);
        return res.status(400).json({
            ok:false,
            message: 'Error de validación',
            errors
        })
    }

    //Error personalizado de Multer (tipo de archivo)
    if(err.message && err.message.includes('Solo se permiten imágenes')){
        return res.status(400).json({
            ok: false,
            message: err.message
        })
    }

    //Error de Multer (tamaño excedido en los archivos)
    if(err.name === 'MulterError'){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                ok: false,
                message: 'El archivo excede el tamaño máximo de 2MB'
            })
        }
        //¿Qué pasa si hay un error en el cual se subieron más archivos de los permitidos?
    }

    //Error genérico
    res.status(err.statusCode || 500).json({
        ok:false,
        message: err.message || 'Error interno del servidor'
    })

}

module.exports = errorHandler;