const Product = require('../models/Product');
const {deleteOneFile, cleanUploadsFiles, getCompleteRoute, deleteFiles } = require('../utils/fileCleanup');


//Obtener los productos
const getAllProducts = async (req,res,next) => {
    try {
        const products = await Product.find().sort({createAt: -1}); //traemos los productos ordenados por los mas nuevos a los mas viejos

        if(!products || products.length === 0){
            return res.status(404).json({
                ok:false,
                message: 'No se encontraron libros en stock'
            })
        }

        return res.status(200).json({
            ok:true,
            message: 'Lista de libros obtenida correctamente 📚',
            data:products
        })
        
    } catch (error) {
        next(error)
    }
}

//Buscar un producto


//Obtener un producto por su ID


// Crear producto (solo admin o super admin)
const createProduct = async (req, res, next) => {
    try {
        // capturo la información
        const { title, author, price, description, genre, publisher, stock } = req.body;

        //Verificar que se hayan subido imagenes
        if(!req.files || req.files.length === 0){
            return res.status(400).json({
                ok:false,
                message: 'Debes subir al menos 1 imagen del libro'
            })
        }

        //Verificar que no se exceda el límite de 3 imagenes
        if(req.files.length > 3){
            return res.status(400).json({
                ok:false,
                message: 'Máximo 3 imagenes permitidas'
            })
        }

        //mapear el array de imágenes para darle un formato que me sea más cómodo de guardar en mongo
        const images = req.files.map(file => file.filename);

        // creo el nuevo producto
        const product = new Product({
            title, 
            author, 
            price,
            description,
            genre,
            publisher, 
            stock, 
            images
        })

        //Guardarlo en mongo
        await product.save();


        //Respuesta al cliente con mensaje de exito!
        return res.status(201).json({
            ok:true,
            message: 'Producto creado correctamente 📚',
            data: product
        })    
        
    } catch (error) {
        cleanUploadsFiles(req)
        next(error)
    }
}

// Actualizar producto (solo admin o super admin)
const updateProduct = async (req, res, next) => {
    try {
        //1 - Capturamos la info necesaria
        const {id} = req.params; //id del libro
        const { title, author, price, description, genre, publisher, stock } = req.body; //info a actualizar

        // 2 - Buscar el producto por su id
        const product = await Product.findById(id);

        // 3 - Validar que exista el producto
        if(!product){
            cleanUploadsFiles(req)
            return res.status(404).json({
                ok:false,
                message:'Libro no encontrado ❌'
            })
        }

        // 4 - Actualizar los campos del producto CONDICIONALMENTE
        if(title) product.title = title;
        if(author) product.author = author;
        if(price !== undefined) product.price = price;
        if(description) product.description = description;
        if(genre) product.genre = genre;
        if(publisher) product.publisher = publisher;
        if(stock !== undefined) product.stock = stock;

        // 5 - Si se subieron imagenes, tengo que reemplazar las antiguas
        if(req.files && req.files.length > 0){

                //Verificar que no se exceda el límite de 3 imagenes
                if(req.files.length > 3){
                 cleanUploadsFiles(req)
                return res.status(400).json({
                ok:false,
                message: 'Máximo 3 imagenes permitidas'
                })
                 }

                //Buscamos las rutas de las imagenes viejas y las guardamos en una variable
                const oldImages = product.images.map(img => 
                    getCompleteRoute(img, 'products')
                );

                //Eliminamos las imagenes viejas usando las rutas que guardamos antes
                deleteFiles(oldImages)

                //asignar las imagenes nuevas en mongo
                product.images = req.files.map(file => file.filename);
        }

        // 6 - actualizamos el producto en mongo con el save()
        await product.save();

        // 7 - Respuesta al cliente
        return res.status(200).json({
            ok:true,
            message:'Libro actualizado correctamente 📚',
            data: product
        })
        
    } catch (error) {
        cleanUploadsFiles(req)
        next(error)
    }
}

// Eliminar un producto



module.exports = {
    createProduct,
    getAllProducts,
    updateProduct
}