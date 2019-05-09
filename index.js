const mongoose = require('mongoose')
const express = require('express')
const http = require('http')
const socketIo = require('socket.io')
const path = require('path')
const bodyParser = require('body-parser')
const EntradaModel = require('./src/schemas/schemaEntrada')

const webpack = require('webpack')
const webpackDevMiddleware = require('webpack-dev-middleware')
const config = require('./webpack.config')

const app = express()
const server = http.Server(app)
const io = socketIo(server)

app.use(express.static(path.resolve(__dirname, 'public')))
app.use(bodyParser.urlencoded({ extended: true }))
app.use(webpackDevMiddleware(webpack(config)))


io.on('connection', socket =>
{
    console.log('Usuario conectado:', socket.id)



    EntradaModel.find({}, (error, entradas)=>
    {
        socket.emit('entradasDesdeDB', entradas)
    })



    socket.on('entradaEnviada', datos =>
    {
        const entradaModel = new EntradaModel()
        entradaModel.nombre  = datos.usuario
        entradaModel.mensaje = datos.mensaje
        entradaModel.hora    = datos.hora

        entradaModel.save((error, modelEntradas)=>
        {
            if(error) console.log('Error al guardar el usuario en MongoDB', error)
            else
            { 
                EntradaModel.find({}, (error, entradas)=>
                {
                    io.emit('entradasDesdeDB', entradas)
                })
            } 
        })
    })


    socket.on('disconnect', ()=>
    {
        console.log('Usuario desconectado');
    })
})


const port = 3000 || process.env.PORT

server.listen(port, ()=>
{
    console.log('Servidor escuchando en 3000')

    mongoose.connect('mongodb://localhost:27017/chat-01', { useNewUrlParser: true })
    .then(()=> { console.log('Conectado a MongoDB') })
    .catch(error => console.log('Error al conectar a MongoDB'))
})

