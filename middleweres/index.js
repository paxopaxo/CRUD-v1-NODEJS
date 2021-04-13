const validarCampos = require('../middleweres/middlewere')
const validarJWT = require('../middleweres/validar-jwt')
const validaRoles = require('../middleweres/verificar-admin')

module.exports = {
    ...validarJWT,
    ...validaRoles,
    ...validarCampos
}