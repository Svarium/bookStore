//MINI CRUD DE USUARIO  -  AUTH

const fs = require("fs"); //este modulo nos sirve para poder trabajar con archivos. 
const path = require("path"); //con este modulo puedo hacer referencia a ubicaciones o construir la ruta a la ubicación del recurso
const { emit } = require("process");


const filePath = path.resolve(__dirname, "../data/users.json");

//leer usuarios
const readUsers = () => {
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

//escribir usuarios
const writeUsers = (users) => {
    fs.writeFileSync(filePath, JSON.stringify(users, null, 2))
}

const getAllUsers = (req, res) => {
    try {

    const users = readUsers();

    if(users.length === 0){
        return res.status(404).json({
            ok:false,
            message: "No se encontraron usuarios en la base de datos."
        })
    }

    return res.status(200).json({
        ok:true,
        message:"Lista de usuarios obtenida correctamente",
        data:{
            length: users.length,
            users,
        }
    })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)
    }
}

const register = (req, res) => {
    try {

        const { email, password } = req.body;

        //validamos que llegue la info basica
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Email y contraseña son requeridos'
            })
        }

        //validamos que el email no este en uso
        const users = readUsers();
        const exist = users.find((u) => u.email === email);

        if (exist) {
            return res.status(409).json({
                ok: false,
                message: "El usuario ya existe :("
            })
        }

        //crear un objeto con la info del nuevo usuario
        const newUser = {
            id: crypto.randomUUID(),
            email,
            password,
        }

        //Sumo el nuevo usuario al array de usuarios
        users.push(newUser);

        //Sobreecribir el json con la info de usuarios actualizada. 
        writeUsers(users);

        return res.status(201).json({
            ok: true,
            message: 'Usuario Registrado con exito :)',
            user: {
                id: newUser.id,
                email: newUser.email
            },
        });

    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)
    }

}

const login = (req, res) => {
        try {

        const {email, password} = req.body;

        //validamos que llegue la info basica
        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Email y contraseña son requeridos'
            })
        }

        const users = readUsers();
        const user = users.find(
            (u) => u.email === email && u.password === password
        );

        if(!user){
            return res.status(401).json({
                ok:false,
                message:"Credenciales incorrectas!!!!!"
            })
        }

        return res.status(200).json({
            ok:true,
            message:"Login Exitoso!",
            user:{
                id: user.id, email:user.email
            }
        });

            
        } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)
        }
}

const deleteUser = (req, res) => {
    try {
     const {id} = req.params; //capturamos el id que viaja en el parametro de la ruta

     const users = readUsers();
     const exist = users.find((u) => u.id === id);

     if(!exist){
        return res.status(404).json({
            ok:false,
            message:"Usuario no encontrado"
        })
     }

     const filtered = users.filter((u) => u.id != id);
     writeUsers(filtered)

     return res.status(200).json({
        ok:true,
        message:"usuario eliminado correctamente",
        deletedUser: {id: exist.id, email: exist.email}
     })
        
    } catch (error) {
        console.log(error)
        return res.status(500).json(error.message)
    }
}



module.exports = {
    register,
    login,
    getAllUsers,
    deleteUser
}