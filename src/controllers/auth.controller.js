//MINI CRUD DE USUARIO  -  AUTH
const User = require('../models/User');
const { sendVerificationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const { deleteOneFile } = require('../utils/fileCleanup');

// Función auxiliar para poder generar el token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET,{
        expiresIn: '1h'
    });
};


const register = async (req, res, next) => {          
    
        try {
        const {name, surname, email, password} = req.body;      

        //Crear el usuario con mongoose
        const newUser = await User.create({
            name, 
            surname,
            email, 
            password,
            profilePic: req.file ? req.file.filename  : null          
        });

        //llamar al método del usuario que crea el código de verificación
        const code = newUser.generateVerificationCode();
        await newUser.save();

        //enviar el codigo via email con la función de nodemailer
        try {            
        await sendVerificationEmail(email, name, code)            
        } catch (emailError) {
            //Si falla el envio del email, eliminar el usuario y foto
            await User.findByIdAndDelete(newUser._id);
            if(req.file){
                (req.file.path)
            }
            return res.status(500).json({
                ok:false,
                message: "Error al enviar el email de verificación. Por favor, intenta nuevamente"
            })
        }     

        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado con exito!!',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                photo: newUser.profilePic
            },
        })            
        } catch (error) {
            next(error)
        }
}

const verifyEmail = async (req, res, next) => {

    try {

        const {email, code} = req.body;

        // Si el email ya está verificado ¿?
        const user = await User.findOne({email});

        if(user.verifiedEmail){
            return res.status(400).json({
                success: false,
                message: "El Email ya está verificado"
            })
        }

        // Verificar el código y su expiración
        if(user.verificationCode !== code){
            return res.status(400).json({
                success: false,
                message: 'Codigo de verificación incorrecto'
            })
        }

        if(new Date() > user.codeExpiration){
           return res.status(400).json({
            success: false,
            message: 'El código de verificación expiró'
           }) 
        }

        // Marcar el email del usuario como verificado
        user.verifiedEmail = true;
        user.verificationCode = null;
        user.codeExpiration = null;
        await user.save(); //me siento en la hoguera para salvar el punto

        return res.status(200).json({
            success: true,
            message: 'Email verificado exitosamente. Ahora podes iniciar sesión'
        })
        
    } catch (error) {
        next(error)
    }

}

const login = async (req, res, next) => {
        try {

        const {email, password} = req.body;    

        const user = await User.findOne({email});

        //Verificar la password
        const validPassword = await user.comparePasswords(password);
        
        if(!validPassword){
            return res.status(401).json({
                ok:false,
                message:'Credenciales inválidas ❌'
            })
        }

       //Validar que el email del usuario este verificado 
       if(!user.verifiedEmail){
        return res.status(403).json({
            ok:false,
            message:"Debes Verificar tu email para poder iniciar sesión 💻"
        })
       }

       //Generar token
       const token = generateToken(user._id);


       // Enviar/responder una cookie con el token
       res.cookie('token', token, {
        httpOnly:true,
        sameSite:'lax',
        maxAge: 60 * 60 * 1000, //1hs
        secure: true
       })
        

        return res.status(200).json({
            ok:true,
            message: 'Login Exitoso 🚀',
            data:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
        })
            
        } catch (error) {
            console.error(error)
            return res.status(500).json({
                ok:false, 
                message: error.message
            })
        }
}

const logout = async (req,res, next) => {
    try {
    res.clearCookie('token');
    return res.status(200).json({
        ok:true, 
        message: 'Logout exitoso!'
    })         
    } catch (error) {
        next(error)
    }
}

const getUserProfile = async (req,res, next) => {
    try {
        
     const user = await User.findById(req.user._id)
     .select('-password -verificationCode -codeExpiration')
     ;
     
     return res.status(200).json({
        ok:true,
        message: "Perfil del usuario obtenido correctamente",
        data: user
     })
    } catch (error) {
        next(error)
    }
}


const updateProfilePhoto = async (req,res, next) => {
    try {

        // validamos que el usuario suba una foto
        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:"no se proporcionó ninguna imagen"
            })
        }

        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration')
        ;

        // Eliminar la foto anterior si es que existe
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../../uploads/profiles',user.profilePic)
            deleteOneFile(previousPhoto)
        }

        // Actualizar con la nueva foto que envie el usuario
        user.profilePic = req.file.filename;
        await user.save()

        //enviamos la respuesta
        return res.status(201).json({
            ok:true,
            message:"foto de perfil actualizada 😊",
            data: user.profilePic
        })
        
    } catch (error) {
        next(error)
    }
}



/* 

const getAllUsers = async (req,res) => {
    try {
     const users = await User.find().select("-password");

     // validamos que existan usuarios para enviar mensaje al front
     if(users.length === 0){
        return res.status(404).json({
            ok:false, 
            message: "No se encontraron usuarios en la base de datos 😥"
        })
     }

     return res.status(200).json({
        ok:true,
        message:"Usuarios obtenidos correctamente",
        data: {
            length: users.length,
            users
        }
     }) 
         
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}


const updateUserRole = async (req, res) => {
    try {

        const {id} = req.params;
        const {role} = req.body;

       //buscar y actualizar el usuario
       const updateUser = await User.findByIdAndUpdate(
        id,
        {role},
        {new: true, runValidators:true}
       ).select("-password");


       return res.status(200).json({
        ok:true, 
        message: `Rol actualizado correctamente!`,
        user: {
            id: updateUser._id,
            name: updateUser.name,
            email: updateUser.email,
            role: updateUser.role
        }
    })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}

const deleteUser = async (req,res) => {
    try {
        const {id} = req.params;

        const deletedUser = await User.findByIdAndDelete(id).select("-password");

        return res.status(200).json({
            ok:true,
            message: 'Usuario eliminado exitosamente!',
            user: deletedUser
        })
        
    } catch (error) {
        console.error(error)
        return res.status(500).json({
            ok:false, 
            message: error.message
        })
    }
}

 */



module.exports = {
    register, 
    login,
    verifyEmail,
    logout,
    getUserProfile,
    updateProfilePhoto
}