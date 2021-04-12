const { response, request } = require('express')
const bcryptjs = require('bcryptjs')

const Usuario = require('../models/usuarioSchema')


const usuariosGet = async(req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query; // aquí estan los argumentos que se pasan junto con el link

    const filter = { estado: true }

    const resp = await Promise.all([
        Usuario.countDocuments(filter),
        Usuario.find(filter)
        .skip(Number(desde))
        .limit(Number(limite))
    ])
    const [total, usuarios] = resp

    res.json({
        total,
        usuarios
    })
}
const usuariosPost = async(req = request, res = response) => {
    try {
        const { nombre, correo, pass, rol } = req.body // req.body es el cuerpo de el json ( el objeto en si ) viene parseado y todo mi bro // Se desestructura para tomar únicamente los elementos del objeto necesarios
        const usuario = new Usuario({ nombre, correo, pass, rol })
            // encriptar la contraseña
        const salt = bcryptjs.genSaltSync() // parametro es el número de vueltas (default =10 )
        usuario.pass = bcryptjs.hashSync(pass, salt)
            // guardar en bd 
        await usuario.save()

        res.json({
            usuario: usuario
        })

    } catch (error) {
        throw new Error(error)
    }
}

const usuariosPut = async(req = request, res = response) => {
    const { id } = req.params // recibe los parametros que se reciben en el /:id
    const { pass, google, correo, ...resto } = req.body
        // validar contra base de datos 
    if (pass) {
        const salt = bcryptjs.genSaltSync()
        resto.pass = bcryptjs.hashSync(pass, salt)
    }
    const usuario = await Usuario.findByIdAndUpdate(id, resto)

    res.json(usuario)
}


const usuariosDelete = async(req = request, res = response) => {

    const { id } = req.params
        // Se borra físicamente con 
        // const usuario = await Usuario.findByIdAndDelete(id);

    if (await Usuario.findById(id)) {
        res.json({
            ok: true,
            msg: 'No se puede borrar un usuario que no existe en nuestra BD'
        })
    } else {
        const usuario = await Usuario.findOneAndUpdate(id, { estado: false })
        res.json({
            ok: true,
            msg: 'Se ha borrado el usuario de la BD'
        })
    }

}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}