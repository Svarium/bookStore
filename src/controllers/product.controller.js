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
            lenght: products.length,
            data:products
        })
        
    } catch (error) {
        next(error)
    }
}

//Buscar un producto
const searchProduct = async (req,res,next) => {
    try {
        //1. Capturar los parámetros de busqueda de la query
        const {genre, author, title} = req.query;

        //2. Inicializar variable para filtros
        let filters = {}; //porque mongoose espera un objeto en los filtros

        //3. Añadir filtros al objeto pero de manera condicional
        if(genre){
            filters.genre = {$regex: genre, $options: 'i'}
        }

        if(author){
            filters.author = {$regex: author, $options: 'i'}
        }

        if(title){
            filters.title = {$regex: title, $options: 'i'}
        }

        //4. Aplico los filtros directamente el el metodo find de mongoose
        const products = await Product.find(filters).sort({createdAt:-1});

        //5. Si no encontró porductos doy una respuesta
        if(!products || products.length === 0){
            return res.status(404).json({
                ok:false,
                message:'No se encontraron coincidencias para la busqueda'
            })
        }

        //6. Respuesa al cliente con los resultados
        return res.json({
            ok:true,
            message:'Productos encontrados 📚',
            length: products.length,
            data: products
        })

        
    } catch (error) {
        next(error)
    }
}

//Obtener un producto por su ID
const getProductById = async (req,res,next) => {
    try {       

        //1. Buscar el producto en MONGO
        const product = await Product.findById(req.params.id)
        
        //2. Validar que el producto exista
        if(!product){
            return res.status(404).json({
                ok:false,
                message:'Producto no encontrado'
            })
        }

        //3. Respuesta al cliente
        return res.status(200).json({
            ok:true,
            data:product
        })
        

    } catch (error) {
      next(error)  
    }
}

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
const deleteProduct = async (req,res,next) => {
    try {
      // 1. Buscar el id del producto  
      const {id} = req.params;

      // 2. Buscar el producto en Mongo
      const product = await Product.findById(id);

      // 3. Valido que exista
      if(!product){
        return res.status(404).json({
            ok:false,
            message: 'Producto no encontrado'
        })
      }
      
    // 4. Ubicar las rutas de todas las imagenes del producto   
      const imagesRoutes = product.images.map(img => 
        getCompleteRoute(img, 'products')
    );

    // 5. Eliminamos las imagenes usando las rutas que guardamos antes
    deleteFiles(imagesRoutes)

    // 6. Eliminar el producto
    await Product.findByIdAndDelete(id)

    // 7. Respuesta al cliente
    return res.status(200).json({
        ok:true,
        message:'Producto eliminado 🗑'
    })     
      
        
    } catch (error) {
        next(error)
    }
}


module.exports = {
    createProduct,
    getAllProducts,
    updateProduct,
    deleteProduct,
    searchProduct,
    getProductById
}