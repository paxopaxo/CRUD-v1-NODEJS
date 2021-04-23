// const validarCampos = require('../middleweres/middlewere')
// const validarJWT = require('../middleweres/validar-jwt')
// const validaRoles = require('../middleweres/verificar-admin')

// module.exports = {
//     ...validarJWT,
//     ...validaRoles,
//     ...validarCampos
// }

const { validarCampos } = require('./middlewere')
const { validarJWT } = require('./validar-jwt')
const { verificarAdmin, tieneRole } = require('./verificar-admin')
const { verifica_query_limites } = require('./verifica-query-limite-inicio')


module.exports = {
    verificarAdmin,
    tieneRole,
    validarCampos,
    validarJWT,
    verifica_query_limites
}