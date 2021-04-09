const { validationResult } = require('express-validator')

const validarCampos = (req, res, next) => { // validationResult es un middlewere que verifica los resultados de express-validator
    const errors = validationResult(req) //   validationResult devuelve los errores en forma de objeto

    if (!errors.isEmpty()) {
        return res.status(400).json(errors)
    }
    next()
}








module.exports = {
    validarCampos
}