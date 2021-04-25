const { response } = require("express");
const path = require('path')
const fs = require('fs')
const cloudinary = require('cloudinary').v2

cloudinary.config(process.env.CLOUDINARY_URL)

const { subirArchivo } = require('../helpers/subir-archivo')
const { validarArchivoSubir } = require('../middleweres/index')
const { Usuario, Producto } = require('../models')


const cargarArchivo = async(req, res = response) => {
    try {
        const nombre = await subirArchivo(req.files, undefined, 'imgs')
        res.json({ nombre })
    } catch (msg) {
        res.status(400).json({ msg })
    }
}

const actualizarImagen = async(req, res) => {

    const { id, coleccion } = req.params

    let modelo
    try {
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')

                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break
            default:
                break;
        }
        // Limpiar imagenes previas 
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if (fs.existsSync(pathImagen)) {
                fs.unlinkSync(pathImagen)
            }
        }

        const nombre = await subirArchivo(req.files, undefined, coleccion)
        modelo.img = nombre

        await modelo.save()
        modelo = modelo
        res.json(modelo)

    } catch (error) {
        res.json({ error })
    }
}


const actualizarImagenCloudinary = async(req, res) => {

    const { id, coleccion } = req.params

    let modelo
    try {
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')

                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break
            default:
                break;
        }
        // Limpiar imagenes previas 
        if (modelo.img) {
            const public_id = modelo.img.split('/').pop().split('.').shift()
            cloudinary.uploader.destroy(public_id)
        }
        const { tempFilePath } = require = req.files.archivo
        const { secure_url } = await cloudinary.uploader.upload(tempFilePath)

        modelo.img = secure_url

        await modelo.save()

        res.json(modelo)

    } catch (error) {
        res.json({ error })
    }
}


const mostrarImage = async(req, res) => {
    const { id, coleccion } = req.params

    let modelo
    try {
        switch (coleccion) {
            case 'usuarios':
                modelo = await Usuario.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')
                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break;
            case 'productos':
                modelo = await Producto.findById(id)
                    .populate('categoria', 'nombre')
                    .populate('usuario', 'nombre')

                if (!modelo) {
                    return res.status(400).json({ msg: `No existe un usuario con el id ${id}` })
                }
                break
            default:
                break;
        }
        // Limpiar imagenes previas 
        if (modelo.img) {
            const pathImagen = path.join(__dirname, '../uploads', coleccion, modelo.img)
            if (fs.existsSync(pathImagen)) {
                return res.sendFile(pathImagen)
            }
        }
        res.sendFile(path.join(__dirname, '../assets/no-image.jpg'))

    } catch (error) {
        res.json({ error })
    }
}



module.exports = {
    cargarArchivo,
    actualizarImagen,
    mostrarImage,
    actualizarImagenCloudinary
}