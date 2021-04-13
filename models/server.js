const express = require('express')
const cors = require('cors')
const { dbConnection } = require('../database/config')

class Server {
    constructor() { // El constructor se ejecuta apenas se crea una instancia de clase 
        this.app = express()
        this.port = process.env.PORT
        this.usuariosPath = '/api'
        this.authPath = '/api/auth'
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
        this.app.use(this.usuariosPath, require('../routes/user.js'))
        this.app.use(this.authPath, require('../routes/auth.js'))
    }
    listen() {
        this.app.listen(this.port, () => {
            console.log('Servidor corriendo en el puerto ', this.port)
        })
    }

}

module.exports = Server;