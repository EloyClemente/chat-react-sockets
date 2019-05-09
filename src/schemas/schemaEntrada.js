const mongoose = require('mongoose')
const Schema = mongoose.Schema


const EntradaModel = new Schema({
    nombre: String,
    mensaje: String,
    hora: String
})

module.exports = mongoose.model('Entrada', EntradaModel)

