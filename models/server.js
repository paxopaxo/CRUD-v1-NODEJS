const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
    constructor() { // El constructor se ejecuta apenas se crea una instancia de clase 
        this.app = express()
        this.port = process.env.PORT

        this.paths = {
            usuarios: '/api',
            auth: '/api/auth',
            categorias: '/api/categorias',
            productos: '/api/productos',
            buscar: '/api/buscar'
        }

        // Conectar a la base de datos 
        this.conectarDB()
            // Middlewares
        this.middlewares()
            // Rutas de mi aplicación 
        this.routes()
    }

    async conectarDB() {
        await dbConnection()
    }
    middlewares() {
        // Cors 
        this.app.use(cors())
            // Lectura y parseo del body
        this.app.use(express.json())
            // directorio público
        this.app.use(express.static('public'))

    }

    routes() {
        this.app.use(this.paths.buscar, require('../routes/buscar.js'))
        this.app.use(this.paths.auth, require('../routes/auth.js'))
        this.app.use(this.paths.categorias, require('../routes/categorias.js'))
        this.app.use(this.paths.productos, require('../routes/productos.js'))
        this.app.use(this.paths.usuarios, require('../routes/user.js'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port)
        })
    }

}

module.exports = Server;