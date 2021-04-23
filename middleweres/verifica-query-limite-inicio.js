const { request } = require('express')

const verifica_query_limites = (req = request, res, next) => {
    const { limite, inicio } = req.query
    if (!limite && !inicio) {
        return res.status(400).json({
            msg: 'Debes entregar los parametros en el query'
        })
    }
    next()
}





module.exports = {
    verifica_query_limites
}