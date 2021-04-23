const Role = require('../models/role')
const { Usuario, Producto, Categoria } = require('../models')

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
const existeCategoriaEnMiDB = async(nombre_categoria = '') => {
    const upperCaseCategory = nombre_categoria.toUpperCase()
    const existeCategoria = await Categoria.findOne({ nombre: upperCaseCategory })
    if (!existeCategoria) {
        throw new Error(`La categoria ${nombre_categoria} no existe en nuestra base de datos`)
    }
}
const existeProductoConElNombre = async(nombre) => {
    const upperCaseProduct = nombre.toUpperCase()
    const existeProducto = await Producto.findOne({ nombre: upperCaseProduct })
    if (existeProducto) {
        throw new Error(`El producto ${existeProducto.nombre} ya existe`)
    }
}

module.exports = {
    esRolValido,
    emailExiste,
    existeIdEnMiDB,
    existeCategoriaEnMiDB,
    existeProductoConElNombre
}