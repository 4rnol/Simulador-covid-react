import React from 'react';
import {NavLink} from "react-router-dom";
import './styleHeader.css';



function Header() {
    
    return(
        
    
        <div className='head-container'>
            
            <div className="title">
                    Simulador de Covid
            </div>
            <div className='nav_bar'>
                <div className="g">
                <NavLink exact activeClassName="active_nav" className="l" to="/">Inicio</NavLink>
                </div>                        
            
                <div className="g">
                <NavLink activeClassName="active_nav" className="l" to="/Simular">Simular</NavLink>
                </div>                                                                
            
                <div className="g">
                <NavLink activeClassName="active_nav" className="l" to="/Graficos">Gráficos</NavLink>
                </div>
            </div>
        </div>
        
                                   
    );
    
}

export default Header;
