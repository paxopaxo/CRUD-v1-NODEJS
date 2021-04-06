const { Router } = require('express')
const { usuariosGet, usuariosPost, usuariosPut, usuariosDelete } = require('../controllers/usuarios.js')
const router = Router()

router.get('/', usuariosGet)
router.post('/:id', usuariosPost) // :id obtiene el id y lo parsea en req.params
router.put('/', usuariosPut)
router.delete('/', usuariosDelete)

module.exports = router