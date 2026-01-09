const User = require('../models/User');

const createSuperAdmin = async () => {
    try {
         const superAdminEmail = process.env.ADMIN_EMAIL

         // Verificar si ya existe el super admin
         const existingSuperAdmin = await User.findOne({email:superAdminEmail});

         if(existingSuperAdmin){
            console.log('✔ Super Admin ya existe!')
            return
         }

         //Crear super admin
         const superAdmin = new User({
            email: superAdminEmail,
            password: process.env.ADMIN_PASSWORD,
            name: process.env.ADMIN_NAME,
            surname: process.env.ADMIN_LASTNAME,
            role:'superadmin',
            verifiedEmail: true
         })

         await superAdmin.save() //para que se gaurde en la base de datos
         console.log('👩‍💻 Super admin creado exitosamente!')        
    } catch (error) {
        console.error('❌ Error al crear Super Admin: ', error.message)
    }
}

module.exports = createSuperAdmin;