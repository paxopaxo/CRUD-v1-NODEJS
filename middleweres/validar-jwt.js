const jwt = require('jsonwebtoken')
const { request, response } = require('express')
const Usuario = require('../models/usuarioSchema')

const validarJWT = async(req = request, res = response, next) => {
    const token = req.header('x-token')
    if (!token) {
        return res.status(401).json({
            msg: 'No hay token para la petición'
        })
    }
    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY) // EL TOKEN ALMACENA EL UID 
        req.uid = uid

        const usuarioAutenticado = await Usuario.findById(uid)
        req.usuarioAutenticado = usuarioAutenticado
            // verificar si la cuenta del wn que se logeo esta activa 
        if (!usuarioAutenticado) {
            return res.status(401).json({
                msg: 'Token no válido -- Token no valido ---- Usuario no existe en BD'
            })
        }
        if (!usuarioAutenticado.estado) {
            return res.status(401).json({
                msg: 'Token no válido -- Token no valido ---- El usuario no existe {estado = false}'
            })
        }

        next()
    } catch (error) {
        console.log(error)
        res.status(401).json({
            msg: `Tu sesión ha expirado, inicia sesión nuevamente`
        })
    }
}


module.exports = {
    validarJWT
}