const { v4: uuidv4 } = require('uuid');
const path = require('path')

const subirArchivo = (files, extensionesValidas = ['png', 'jpg', 'jpeg', 'gif'], carpeta = '') => {
    return new Promise((resolve, reject) => {

        if (!files) {
            return reject(`Debes enviar la imagen con el Key archivo`)
        }

        const { archivo } = files

        const extension = archivo.name.split('.').pop()

        // extensiones validas
        if (!extensionesValidas.includes(extension)) {
            return reject(`La extensión ${extension} no es válida, solo se aceptan las extensiones ${ extensionesValidas.join(', ')}`)
        }

        const nombreTemporal = uuidv4() + '.' + extension
        const uploadPath = path.join(__dirname, '../uploads/', carpeta, nombreTemporal)

        archivo.mv(uploadPath, function(err) {
            if (err) {
                reject(err)
            }

            resolve(nombreTemporal)
        });

    })


}

module.exports = {
    subirArchivo
}