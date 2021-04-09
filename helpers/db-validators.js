const Role = require('../models/role')
const Usuario = require('../models/usuarioSchema')

const esRolValido = async(rol_recibido = '') => {
    const existeRol = await Role.findOne({ rol: rol_recibido })
    if (!existeRol) {
        throw new Error(`EL ROL ${ existeRol } NO EXISTE!`)
    }
}
const emailExiste = async(correo_recibido = '') => {
    const existeEmail = await Usuario.findOne({ correo: correo_recibido })
    if (existeEmail) {
        throw new Error('El email que ingresaste ya existe en nuestra base de datos')
    }
}
const existeIdEnMiDB = async(id_recibido = '') => {
    const existeid = await Usuario.findOne({ _id: id_recibido })
    if (!existeid) {
        throw new Error(`El id ${id_recibido} no existe en nuestra base de datos`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeIdEnMiDB
}