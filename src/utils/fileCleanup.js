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



//Eliminar archivos subidos pir multer (req.file o req.files)
const cleanUploadsFiles = (req) => {
    if(req.file){
        deleteOneFile(req.file.path)
    }

    if(req.files && Array.isArray(req.files)){
        req.files.forEach(file => deleteOneFile(file.path))
    }
}


module.exports = {
    deleteOneFile,
    cleanUploadsFiles
}