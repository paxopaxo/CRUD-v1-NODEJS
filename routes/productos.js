const { Router } = require('express')
const { check } = require('express-validator')

// middleweres
const { validarCampos, validarJWT, verifica_query_limites, tieneRole } = require('../middleweres')
    //helpers 
const { existeCategoriaEnMiDB, existeProductoConElNombre } = require('../helpers/db-validators')
const { existeIdenMiDBProductos } = require('../helpers/validar-id')

//controllers
const {
    eliminarProductoPorId,
    actualizarInfoProductos,
    obtenerTodosProductos,
    crearProducto,
    obtenerProductoPorId
} = require('../controllers/productos')


const router = Router()

// obtener las categorias -- publico 

router.get('/', [
    verifica_query_limites
], obtenerTodosProductos)

// obtener una categoria por id - publico 
router.get('/:id', [
    check('id', 'El id no es de mongo').isMongoId(),
    validarCampos,
    check('id').custom(existeIdenMiDBProductos),
    validarCampos
], obtenerProductoPorId)

// crear categoria - privado - cualquier persona con un token valido 

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre debe ser obligatorio').notEmpty(),
    check('categoria', 'Debes insertar una categoria').notEmpty(),
    validarCampos,
    check('nombre').custom(existeProductoConElNombre),
    check('categoria').custom(existeCategoriaEnMiDB),
    validarCampos
], crearProducto)

// actualizar - privado - cualquiera con token valido 

router.put('/:id', [
    validarJWT,
    check('id', 'Debes inresar un id').notEmpty(),
    validarCampos,
    check('id', 'El id no es de mongo').isMongoId(),
    check('disponible', 'disponible debe ser true o false').optional().isBoolean(),
    check('nombre', 'El nombre debe ser una cadena').optional().isString(),
    check('descripcion', 'La descripcion debe ser una cadena').optional().isString(),
    check('categoria', 'La categoria debe ser string').optional().isString(),
    validarCampos,
    check('id').custom(existeIdenMiDBProductos),
    validarCampos
], actualizarInfoProductos)

// borrar una categoria - privado - admin

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(existeIdenMiDBProductos),
    validarCampos
], eliminarProductoPorId)





module.exports = router;