//MINI CRUD DE USUARIO  -  AUTH
const User = require('../models/User');


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

const register = async (req, res) => {
    
        try {

        const {name, email, password} = req.body;      

        //Crear el usuario con mongoose
        const newUser = await User.create({
            name, 
            email, 
            password,            
        });

        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado con exito!!',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
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

const login = async (req, res) => {
        try {

        const {email, password} = req.body;

         //validar que llegue la info basica
         if(!email || !password){
            return res.status(400).json({
                ok:false,
                message: 'Todos los campos son obligatorios 🤬'
            })
        }

        const user = await User.findOne({email, password});

        if(!user){
            return res.status(401).json({
                ok:false,
                message: 'Credenciales incorrectas'
            })
        }

        return res.status(200).json({
            ok:true,
            message: 'Login Exitoso 🚀',
            user:{
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
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

const updateUserRole = async (req, res) => {
    try {

        const {id} = req.params;
        const {role} = req.body;

       if(!role){
        return res.status(400).json({
            ok:false, 
            message: 'El rol es requerido'
        })
       } 

       //Validamos que el rol sea el correcto. 
       const allowRoles = ['user', 'admin', 'superadmin'];

       if(!allowRoles.includes(role)){
        return res.status(400).json({
            ok:false, 
            message: `El rol debe ser uno de los siguientes: ${allowRoles.join(', ')}`
        })
       }

       //buscar y actualizar el usuario
       const updateUser = await User.findByIdAndUpdate(
        id,
        {role},
        {new: true, runValidators:true}
       ).select("-password");

       if(!updateUser){
        return res.status(404).json({
            ok:false, 
            message: `Usuario no encontrado`
        })
       }

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

        if(!deletedUser){
            return res.status(404).json({
                ok:false,
                message: 'Usuario no encontrado'
            })
        }

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




module.exports = {
    register, 
    login,
    getAllUsers,
    updateUserRole,
    deleteUser  
}