// const { response } = require('express')


const usuariosGet = (req, res = response) => {

    const query = req.query; // aquí estan los argumentos que se pasan junto con el link

    res.json({
        ok: true,
        msg: 'desde el controlador',
        query
    })
}
const usuariosPost = (req, res) => {

    const body = req.body // req.body es el cuerpo de el json ( el objeto en si )
    const { id } = req.params // recibe los parametros que se reciben en el /:id

    res.json({
        ok: true,
        msg: 'post api',
        id
    })
}

const usuariosPut = (req, res) => {
    res.json({
        ok: true,
        msg: 'put api'
    })
}


const usuariosDelete = (req, res) => {
    res.json({
        ok: true,
        msg: 'delete api'
    })
}

module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete
}