import React from 'react'
import { PromiseProvider } from 'mongoose';

export default (props)=>
{
    return(
        <div className="css_container-titulo-user">
            <p className="css_titulo">React Sockets</p>
            <input 
            type="text" 
            className="css_inputUser"
            placeholder="Usuario"
            onBlur={ props.usuario() }
            >
            </input>
        </div>
    ) 
}