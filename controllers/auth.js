const { response, request } = require('express')
const Usuario = require('../models/usuarioSchema')
const bcryptjs = require('bcryptjs')

const generarJWT = require('../helpers/generar-jwt')
const { googleVerify } = require('../helpers/google-verify')

const login = async(req = request, res = response) => {

    const { correo, pass } = req.body

    try {
        // verificar si el email existe 

        const usuario = await Usuario.findOne({ correo: correo })
        if (!usuario) {
            return res.status(400).json({
                msg: 'Usuario / Password no son correctos - correo'
            })
        }
        // si el usuario está activo 
        if (!usuario.estado) {
            return res.status(400).json({
                msg: 'Usuario / passoword no son correctos - estado: false'
            })
        }
        // verirficar la contraseña 
        const validPassword = bcryptjs.compareSync(pass, usuario.pass)
        if (!validPassword) {
            return res.json({
                msg: 'La contraseña no es valida'
            })
        }

        //generar el jwt 
        const token = await generarJWT(usuario._id)

        res.json({
            usuario,
            token

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({
            msg: 'Hable con el administrador '
        })
    }
}

const googleSignIn = async(req, res = response) => {

    const { id_token } = req.body
    try {
        const { correo, nombre, img } = await googleVerify(id_token)

        let usuario = await Usuario.findOne({ correo })

        if (!usuario) {
            const data = {
                nombre,
                correo,
                img,
                pass: ':P',
                google: true
            }

            usuario = new Usuario(data) // CREA UN NUEVO REGISTRO CON LA SIGUIENTE DATA 
            await usuario.save
        }
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Usuario bloquedo en nuestra base de datos'
            })
        }

        const token = await generarJWT(usuario._id) // GENERA UN TOKEN 

        res.json({
            msg: 'Todo OK! google sign in',
            usuario,
            token
        })

    } catch (error) {
        res.status(400).json({
            msg: 'token de google no es reconocido'
        })
    }

}






module.exports = {
    login,
    googleSignIn
}