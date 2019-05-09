import React, { Component } from 'react'
import { render } from 'react-dom'
import Titulo from './components/titulo'
import io from 'socket.io-client'


class App extends Component{

    constructor()
    {
        super()
        this.state = {
            usuario: 'User',
            texto: '',
            entradas: []
        }


        this.nombreUsuario = this.nombreUsuario.bind(this)
        this.modificarTexto = this.modificarTexto.bind(this)
        this.insertarEntrada = this.insertarEntrada.bind(this)
    }


    


    componentDidMount()
    {
        this.socket = io()

        this.socket.on('entradasDesdeDB', entradas =>
        {
            if(entradas.length > 0)
            {
                this.setState({ entradas: entradas }, ()=> 
                {
                    // Mueve el scroll al final
                    this.refs.pantalla.scrollTo(0, this.refs.pantalla.scrollHeight)
                })
            }
        })

        if(localStorage.getItem('usuario'))
        {
            this.setState({ usuario: localStorage.getItem('usuario') })
        }

        // Para insertar con ENTER
        window.addEventListener('keyup', event =>
        {
            if(event.keyCode == 13)
            {
                this.insertarEntrada()
            }
        })
    }


    nombreUsuario(event)
    {
        localStorage.setItem('usuario', event.target.value)      // this.setState({ usuario: nombre })
        this.setState({ usuario:  localStorage.getItem('usuario') })
    }


    modificarTexto(event)
    {
        this.setState({ texto: event.target.value })
    }



    insertarEntrada()
    {
        const time = new Date()
        const hour = time.getHours()
        const mins = time.getMinutes()

        if(this.state.texto != '')
        {
            const datos = {
                usuario: this.state.usuario,
                mensaje: this.state.texto,
                hora: hour + ':' + mins
            }

            this.socket.emit('entradaEnviada', datos)
            this.setState({ texto: '' })
        }
    }



    render(){
        return(
            <div className="css_container">

                <Titulo usuario={ ()=> this.nombreUsuario } />

                <div ref="pantalla" className="css_pantalla">

                    {
                        this.state.entradas.map(entrada=>( 
                            <div key={ entrada._id }>
                                <p className="css_entrada-nombre">{ `${entrada.hora} - ${entrada.nombre}` }</p>
                                <p className="css_entrada-mensaje">{ entrada.mensaje }</p>
                            </div>
                        ))
                    }
                    
                </div>

                <div className="css_container_inputText-button">
                    <div className="input-field css_inputText">
                        <input 
                            type="text" 
                            id="last_name" 
                            className="validate"
                            onChange={ this.modificarTexto } 
                            value={ this.state.texto } 
                            >
                        </input>

                        <label htmlFor="last_name">Mensaje</label>
                    </div>
                    <button onClick={ this.insertarEntrada } className="waves-effect waves-light btn">Publicar</button>
                </div>
                
            </div> 
        )
    }
}


render(<App/>, document.getElementById('root'))