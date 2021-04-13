const { response, request } = require("express");


const verificarAdmin = (req = request, res = response, next) => {
    if (!req.usuarioAutenticado) {
        return res.status(500).json({
            msg: 'se quiere verificar el user role sin validar el token primero'
        })
    }
    const { rol, nombre } = req.usuarioAutenticado
    if (rol !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${nombre} no es admin y no puede borrar a un usuario cualquiera`
        })
    }
    next()
}

const tieneRole = (...roles) => { // ...roles devuelve un array con todos los argumentos entregados 
    return (req, res = response, next) => {

        if (!req.usuarioAutenticado) {
            return res.status(500).json({
                msg: 'se quiere verificar el user role sin validar el token primero'
            })
        }

        if (!roles.includes(req.usuarioAutenticado.rol)) {
            return res.status(401).json({
                msg: `El servicio requiere uno de estos roles ${roles}`
            })
        }

        console.log(roles, req.usuarioAutenticado.rol)
        next()
    }
}

module.exports = {
    verificarAdmin,
    tieneRole
}