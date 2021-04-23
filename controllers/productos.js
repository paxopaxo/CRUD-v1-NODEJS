const { response } = require('express')
const { Producto, Categoria } = require('../models')

const crearProducto = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase()
    const categoria = req.body.categoria.toUpperCase()
    const { precio = 0, descripcion = '' } = req.body
    try {
        if (isNaN(precio)) return res.status(400).json({ msg: 'no seai aweonao si el precio tiene que ser un numero' })
        const productoDB = await Producto.findOne({ nombre })
        if (productoDB) {
            return res.status(400).json({
                msg: `El producto ${nombre}, ya existe `
            })
        }
        const categoriaDB = await Categoria.findOne({ nombre: categoria })
            // generar la data a guardar 
        const data = {
            nombre,
            usuario: req.usuarioAutenticado._id,
            precio,
            categoria: categoriaDB._id,
            descripcion
        }

        const producto = new Producto(data)
        await producto.save()

        const saved = await Producto.find({ nombre }).populate('usuario', 'nombre').populate('categoria', 'nombre')

        res.status(201).json({ // 201 cuando se crea algo exitoso 
            msg: `La categoría ${nombre} fue creada por el usuario siguiente: `,
            usuario: req.usuarioAutenticado,
            saved
        })

    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: error,
            error_pers: 'Crear categoría ha fallado'
        })
    }

}
const obtenerProductoPorId = async(req, res) => {
    const { id } = req.params
    try {
        const producto = await Producto.findOne({ _id: id }).populate('usuario', 'nombre').populate('categoria', 'nombre')
        res.status(200).json({
            msg: `El id del producto id ${id} si existe y es la siguiente `,
            producto
        })
    } catch (error) {
        console.log(error)
    }
}
const obtenerTodosProductos = async(req, res) => {
    const { limite = 5, inicio = 0 } = req.query; // aquí estan los argumentos que se pasan junto con el link

    const filter = { estado: true }

    const resp = await Promise.all([
        Categoria.countDocuments(filter), // cuenta cuantos docuemntos cumplen condicion
        Categoria.find(filter) //duelve todo lo que encaje con el filtro
        .populate('usuario', 'nombre')
        .skip(Number(inicio))
        .limit(Number(limite))
    ])
    const [total, usuarios] = resp

    res.json({
        total,
        usuarios
    })
}

const actualizarInfoProductos = async(req, res) => {
    try {
        const { id } = req.params
        const { estado, ...resto } = req.body

        if (resto.nombre) {
            resto.nombre = resto.nombre.toUpperCase()
        }
        resto.usuario = req.uid

        if (resto.precio) {
            if (isNaN(resto.precio)) return res.status(400).json({ msg: 'no seai aweonao si el precio tiene que ser un numero' })
        }
        if (resto.categoria) {
            resto.categoria = resto.categoria.toUpperCase()
            const existeCategoria = await Categoria.findOne({ nombre: resto.categoria })
            if (!existeCategoria) {
                res.status(400).json({ msg: `La categoria ${resto.categoria} no existe en nuestra base de datos` })
            } else {
                resto.categoria = existeCategoria._id
            }
        }
        const saved = await Producto.findByIdAndUpdate(id, resto, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre')
        res.status(201).json({ msg: `El producto ha sido guardado correctamente`, saved })

    } catch (error) {
        console.log(error)
    }
}
const eliminarProductoPorId = async(req, res) => {
    const { id } = req.params
    const producto_eliminado = await Producto.findByIdAndUpdate(id, { estado: false }, { new: true }).populate('usuario', 'nombre').populate('categoria', 'nombre')
    res.status(200).json({
        msg: `Se ha borrado el siguiente producto `,
        producto_eliminado
    })
}



module.exports = {
    eliminarProductoPorId,
    actualizarInfoProductos,
    obtenerTodosProductos,
    crearProducto,
    obtenerProductoPorId
}