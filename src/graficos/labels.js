import React from 'react';
import {GridColumn,Grid} from 'semantic-ui-react';


const Labels=(props)=>{
    
    return(
        <div >
        
            <Grid columns={2} celled style={{fontSize:"20px",backgroundColor:"#dadddd"}}>
                    <GridColumn >
                    <div align="center" >
                        <label style={{}}>Poblacion Total Contagiada: </label>  <label><strong>{props.totalContagios}</strong> habitantes</label>                    
                    </div>
                    <div align="center">
                        <label style={{}}>Poblacion Total Recuperada: </label> <label><strong>{props.totalRecuperaciones}</strong> habitantes</label>
                    </div>
                    <div align="center">
                        <label style={{}}>Poblacion Total Fallecida:</label> <label><strong>{props.totalFallecimientos}</strong> habitantes</label>
                    </div>
                    </GridColumn>
                    <GridColumn>
                    <div align="center">
                        <label style={{}}>Max. contagios diarios:</label> <label><strong>{props.maxContagios}</strong> habitantes</label>
                    </div>
                    <div align="center">
                        <label style={{}}>Max. recuperados diarios:</label> <label><strong>{props.maxRecuperaciones}</strong> habitantes</label>
                    </div>
                    <div align="center">
                        <label style={{}}>Max. fallecimientos diarios:</label> <label><strong>{props.maxFallecimientos}</strong> habitantes</label>
                    </div>
                    </GridColumn>
                    </Grid>
                    <div align="center">                    
                    <label  style={{fontSize:"45px",fontWeight:"800"}}>GRAFICO DE ACTIVIDAD</label> 
                    </div>


        </div>
    );
}

export default Labels;