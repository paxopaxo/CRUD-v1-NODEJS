const { Categoria, Producto } = require("../models")

const existeIdEnMiDBCategorias = async(id_recibido = '') => {
    const existeid = await Categoria.findOne({ _id: id_recibido })
    if (!existeid) {
        throw new Error(`El id ${id_recibido} no existe en nuestra base de datos`)
    }
}
const existeIdenMiDBProductos = async(id_recibido = '') => {
    const existeid = await Producto.findOne({ _id: id_recibido })
    if (!existeid) {
        throw new Error(`El id ${id_recibido} no existe en nuestra base de datos`)
    }
}
module.exports = {
    existeIdEnMiDBCategorias,
    existeIdenMiDBProductos
}