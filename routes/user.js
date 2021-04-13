const { Router } = require('express')
const { check } = require('express-validator')

// const { validarCampos } = require('../middleweres/middlewere')
// const { validarJWT } = require('../middleweres/validar-jwt')
// const { verificarAdmin, tieneRole } = require('../middleweres/verificar-admin')

const { validarCampos, validarJWT, verificarAdmin, tieneRole } = require('../middleweres')

const { esRolValido, emailExiste, existeIdEnMiDB } = require('../helpers/db-validators')
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios.js')

const router = Router()

router.get('/', usuariosGet)

router.post('/', [
        check('correo', 'Esto no es correo').isEmail(),
        check('pass', 'el password debe ser de más de 6 letras').isLength({ min: 6 }),
        check('nombre', 'El nombre es obligatorio').not().isEmpty(),
        // check('rol', 'No es un rol válido').isIn(['ADMIN_ROLE', 'USER_ROLE']),
        check('rol').custom(rol => esRolValido(rol)),
        check('correo').custom(correo => emailExiste(correo)),
        validarCampos
    ], usuariosPost) // :id obtiene el id y lo parsea en req.params


router.put('/:id', [
    check('_id', 'El id en el link ingresado no es de mongo').isMongoId(),
    check('_id').custom(id => existeIdEnMiDB(id)), // HAY QUE PROBAR BIEN ESTA MIERDA MAÑANA DIA 09/04/2021
    validarCampos
], usuariosPut)

router.delete('/:id', [
    validarJWT,
    // verificarAdmin, FUERZA A QUE EL USUARIO SEA ADMIN
    tieneRole('ADMIN_ROLE', 'USER_ROLE'), // Verifica si tiene uno de estos roles
    check('id', 'El id en el link ingresado no es de mongo').isMongoId(),
    check('id').custom(id => existeIdEnMiDB(id)), // HAY QUE PROBAR BIEN ESTA MIERDA MAÑANA DIA 09/04/2021
    validarCampos
], usuariosDelete)

module.exports = router