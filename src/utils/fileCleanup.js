const fs = require('fs');
const path = require('path');

//Eliminar un archivo
const deleteOneFile = (filePath) => {
    try {
        if(fs.existsSync(filePath)){
            fs.unlinkSync(filePath);
            console.log(`🗑 Archivo eliminado: ${filePath}`);
        }

        
    } catch (error) {
        console.error(`❌ Error al eliminar archivo ${filePath} : ${error.message}`)
    }
}

//Eliminar multiples archivos
const deleteFiles = (filePaths) => {
    if(!Array.isArray(filePaths)){
        filePaths = [filePaths]
    }

    filePaths.forEach(filePath => {
        if(filePath){
            deleteOneFile(filePath)
        }
    });
}

//Eliminar archivos subidos por multer (req.file o req.files)
const cleanUploadsFiles = (req) => {
    if(req.file){
        deleteOneFile(req.file.path)
    }

    if(req.files && Array.isArray(req.files)){
        req.files.forEach(file => deleteOneFile(file.path))
    }
}

//Obtener ruta completa del archivo desde nombre
const getCompleteRoute = (filename, type) => {
    return path.join(__dirname, `../../uploads/${type}`, filename)
}


module.exports = {
    deleteOneFile,
    cleanUploadsFiles,
    getCompleteRoute,
    deleteFiles
}