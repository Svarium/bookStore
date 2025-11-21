const express = require("express");

const router = express.Router();

//ENDPOINTS QUE ME LISTA TODOS LOS PRODUCTOS
router.get("/", (req, res) => {
    res.send("Listado de todos los libros de nuestro catálogo")
})

//ENDPOINTS QUE ME LISTA UN SOLO PRODUCTO
router.get("/libro", (req, res) =>{
    res.send("Danza de Dragones - Canción de Hielo y Fuego")
})

router.post("/newBook", (req, res) => {
    const {title, price} = req.body;
    res.send(`El nuevo libro se llama: ${title} || Su valor es de: ${price}`)
})

module.exports = router;
