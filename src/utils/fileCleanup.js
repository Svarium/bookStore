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


module.exports = {
    deleteOneFile
}