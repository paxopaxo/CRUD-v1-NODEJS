const { response } = require('express')
const { Categoria } = require('../models')

const crearCategoria = async(req, res = response) => {
    const nombre = req.body.nombre.toUpperCase()

    try {
        const categoriaDB = await Categoria.findOne({ nombre })

        if (categoriaDB) {
            return res.status(400).json({
                msg: `La categoria ${nombre}, ya existe `
            })
        }
        // generar la data a guardar 
        const data = {
            nombre,
            usuario: req.usuarioAutenticado._id
        }

        const categoria = new Categoria(data)
        await categoria.save()

        res.status(201).json({ // 201 cuando se crea algo exitoso 
            msg: `La categoría ${nombre} fue creada por el usuario siguiente: `,
            usuario: req.usuarioAutenticado.nombre
        })

    } catch (error) {
        res.status(401).json({
            msg: error,
            error_pers: 'Crear categoría ha fallado'
        })
    }

}
const obtenerCategoriaPorId = async(req, res) => {
    const { id } = req.params
    const categoria = await Categoria.findOne({ _id: id }).populate('usuario', 'nombre')
    res.status(200).json({
        msg: `El id de la categoria id ${id} si existe y es la siguiente `,
        categoria
    })
}
const obtenerTodasCategorias = async(req, res) => {
    const { limite = 5, inicio = 0 } = req.query; // aquí estan los argumentos que se pasan junto con el link

    const filter = { estado: true }

    const resp = await Promise.all([
        Categoria.countDocuments(filter), // cuenta cuantos docuemntos cumplen condicion
        Categoria.find(filter) //duelve todo lo que encaje con el filtro
        .populate('usuario', 'nombre')
        .skip(Number(inicio))
        .limit(Number(limite))
    ])
    const [total, categorias] = resp

    res.json({
        total,
        categorias
    })
}

const actualizarInfoCategorias = async(req, res) => {
    const { nombre, ...resto } = req.body
    if (resto === {}) return res.status(400).json({ msg: 'Limitate solo a mandar el nombre', resto })

    Categoria.findByIdAndUpdate(req.uid, { nombre })
    res.status(200).json({
        msg: `El categoria de id ${req.uid} ha sido cambiada por ${nombre}. El cambio fue efecutado por:`,
        usuario: req.usuarioAutenticado
    })
}
const eliminarCategoriaPorId = async(req, res) => {
    const { id } = req.params
    const categoria = await Categoria.findByIdAndUpdate({ _id: id }, { estado: false }).populate('usuario', 'nombre')
    res.status(200).json({
        msg: `El id de la categoria id ${id} si existe y es la siguiente `,
        categoria
    })
}





module.exports = {
    crearCategoria,
    obtenerCategoriaPorId,
    obtenerTodasCategorias,
    actualizarInfoCategorias,
    eliminarCategoriaPorId
}