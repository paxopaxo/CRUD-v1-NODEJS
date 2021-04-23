const { Router } = require('express')
const { check } = require('express-validator')

// middleweres
const { validarCampos, validarJWT, verifica_query_limites, tieneRole } = require('../middleweres')
    //controllers
const { crearCategoria, obtenerCategoriaPorId, obtenerTodasCategorias, actualizarInfoCategorias, eliminarCategoriaPorId } = require('../controllers/categorias')
    //helpers 
const { existeIdEnMiDBCategorias } = require('../helpers/validar-id')


const router = Router()

// obtener las categorias -- publico 

router.get('/', [
    verifica_query_limites
], obtenerTodasCategorias)

// obtener una categoria por id - publico 
router.get('/:id', [
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(existeIdEnMiDBCategorias),
    validarCampos
], obtenerCategoriaPorId)

// crear categoria - privado - cualquier persona con un token valido 

router.post('/', [
    validarJWT,
    check('nombre', 'El nombre debe ser obligatorio').notEmpty(),
    validarCampos
], crearCategoria)

// actualizar - privado - cualquiera con token valido 

router.put('/:id', [
    validarJWT,
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(id => existeIdEnMiDBCategorias(id)),
    check('nombre', 'Debes ingresar en el body el nuevo nombre de la categoría').notEmpty(),
    validarCampos
], actualizarInfoCategorias)

// borrar una categoria - privado - admin

router.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'El id no es de mongo').isMongoId(),
    check('id').custom(id => existeIdEnMiDBCategorias(id)),
    validarCampos
], eliminarCategoriaPorId)





module.exports = router;