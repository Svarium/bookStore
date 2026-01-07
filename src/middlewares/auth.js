const jwt = require('jsonwebtoken');
const User = require('../models/User');

//Verificar si el usuario está autenticado
const verifyAuth = async (req, res, next) => {
    try {

        //capturamos el token desde el req
        const token = req.cookies.token;

        //Validamos que venga el token
        if(!token){
            return res.status(401).json({
                ok:false,
                message: 'No autorizado. Token no proporcionado'
            })
        }

        //decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        //si ese usuario no existe
        if(!user){
            return res.status(401).json({
                ok:false,
                message: 'Usuario no encontrado'
            })
        }

        //Guardar la info del usuario en el objeto req
        req.user = user; // seteo en el objeto req la info del usuario

        next()        
    } catch (error) {
        console.log(error)
        return res.status(401).json({
            ok:false,
            message: 'Token inválido o expirado'
        })
    }
}

module.exports = {
    verifyAuth
}

