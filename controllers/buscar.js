const { response } = require('express')
const { ObjectId } = require('mongoose').Types

const { Usuario, Categoria, Producto } = require('../models')

const coleccionesPermitidas = [
    'usuarios',
    'categorias',
    'productos',
    'roles'
]
const buscarUsuarios = async(termino = '', res) => {
    const esMongoID = ObjectId.isValid(termino) // verifica que es mongoID
    if (esMongoID) {
        const usuario = await Usuario.findById(termino)
        return res.json({
            resultados: (usuario) ? [usuario] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const usuarios = await Usuario.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })

    res.json(usuarios)
}
const buscarCategorias = async(termino, res) => {
    const esMongoID = ObjectId.isValid(termino) // verifica que es mongoID
    if (esMongoID) {
        const categoria = await Categoria.findById(termino)
        return res.json({
            resultados: (categoria) ? [categoria] : []
        })
    }

    const regex = new RegExp(termino, 'i')
    const usuarios = await Categoria.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    res.json(usuarios)
}

const buscarProductos = async(termino, res) => {
    const esMongoID = ObjectId.isValid(termino) // verifica que es mongoID
    if (esMongoID) {
        const producto = await Producto.findById(termino)
        return res.json({
            resultados: (producto) ? [producto] : []
        })
    }
    const regex = new RegExp(termino, 'i')
    const usuarios = await Producto.find({
        $or: [{ nombre: regex }, { correo: regex }],
        $and: [{ estado: true }]
    })
    res.json(usuarios)
}




const buscar = async(req, res = response) => {
    const { coleccion, termino } = req.params

    if (!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({
        msg: `Las colecciones permitidas son las siguientes ${coleccionesPermitidas}`
    })
    switch (coleccion) {
        case 'usuarios':
            await buscarUsuarios(termino, res)
            break;
        case 'categorias':
            await buscarCategorias(termino, res)
            break;
        case 'productos':
            await buscarProductos(termino, res)
            break;
        default:
            res.status(500).json({ msg: 'esta wea no funciona ' })
    }

}


module.exports = {
    buscar
}