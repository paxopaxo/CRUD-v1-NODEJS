const { Router } = require('express')
const { check } = require('express-validator')

const { login } = require('../controllers/auth')
const { validarCampos } = require('../middleweres/middlewere')

router = Router()

router.post('/login', [
    check('correo', 'El correo es obligatorio').isEmail(),
    check('pass', 'La contraseña es obligatoria').not().isEmpty(),
    validarCampos
], login)










module.exports = router