const mongoose = require('mongoose')

const usuarioSchema = mongoose.Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es obligatorio']
    },
    correo: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    pass: {
        type: String,
        required: [true, 'La contraseña es obligatorio']
    },
    img: {
        type: String,
    },
    rol: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE']
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

// usuarioSchema.methods.toJSON = function() { // cuando quiero usar el this dentro de una funcion debo usar funciones normales
//     const { __v, pass, _id, ...usuario } = this.toObject()
//     usuario.uid = _id
//     return usuario;
// }


module.exports = mongoose.model('Usuario', usuarioSchema)