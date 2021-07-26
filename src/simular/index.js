import React, { Component } from 'react';
import { Grid, GridColumn, Divider, Input,Accordion,Icon,Loader } from 'semantic-ui-react';

import Modals from '../Components/modals';
import './styleSimular.css';

import {EnviarDatos} from '../api';

const styles={
    box:{
        marginTop:"35px",
        marginBottom:"20px",
        display:"block",
        marginLeft: "auto",
        marginRight: "auto",
        width: 100,
        height: 50,
        border: '5px solid pink',
        borderRadius: 10,
        backgroundColor:""
    },
    form:{
        position:"relative",
        display:"block",
        marginLeft: "auto",
        marginRight: "auto"
    }
}
export default class Simular extends Component{
    constructor(props) {
        super(props);
        
        this.state = {
            i1:0,i2:0,i3:0,i4:0,i5:0,i6:0,i7:0,i8:0,i9:0,i10:0,i11:0,i12:0,i13:0,i14:0,i15:0,i16:0,i17:0,i18:0,i19:0,i20:0,
            r1:0,r2:0,r3:0,r4:0,r5:0,r6:0,r7:0,r8:0,r9:0,r10:0,r11:0,r12:0,r13:0,r14:0,r15:0,r16:0,r17:0,r18:0,r19:0,r20:0,
            f1:0,f2:0,f3:0,f4:0,f5:0,f6:0,f7:0,f8:0,f9:0,f10:0,f11:0,f12:0,f13:0,f14:0,f15:0,f16:0,f17:0,f18:0,f19:0,f20:0,
                       
            show:false,
            show1:false,
            
            fechaActual:0,
            fechaInicio:0,
            fechaFin:0,
            poblacion:0,
                       
            municipio:'',
            activeIndex:-1            
        };          
    }    

    handleState = (event) => {
        this.setState({
            [event.target.name]: (event.target.value)
        })
    }
    
    simular = () => {
            
            let suma =  (parseInt(this.state.i2) / parseInt(this.state.i1)) + (parseInt(this.state.i3) / parseInt(this.state.i2)) +
                        (parseInt(this.state.i4) / parseInt(this.state.i3)) + (parseInt(this.state.i5) / parseInt(this.state.i4)) + 
                        (parseInt(this.state.i6) / parseInt(this.state.i5)) + (parseInt(this.state.i7) / parseInt(this.state.i6)) + 
                        (parseInt(this.state.i8) / parseInt(this.state.i7)) + (parseInt(this.state.i9) / parseInt(this.state.i8)) +
                        (parseInt(this.state.i10) / parseInt(this.state.i9)) + (parseInt(this.state.i11) / parseInt(this.state.i10)) + 
                        (parseInt(this.state.i12) / parseInt(this.state.i11)) + (parseInt(this.state.i13) / parseInt(this.state.i12)) + 
                        (parseInt(this.state.i14) / parseInt(this.state.i13)) + (parseInt(this.state.i15) / parseInt(this.state.i14)) +
                        (parseInt(this.state.i16) / parseInt(this.state.i15)) + (parseInt(this.state.i17) / parseInt(this.state.i16)) + 
                        (parseInt(this.state.i18) / parseInt(this.state.i17)) + (parseInt(this.state.i19) / parseInt(this.state.i18)) +
                        (parseInt(this.state.i20) / parseInt(this.state.i19));
            
            let tasai = (suma / 19);

            let E = parseInt(this.state.f1) + parseInt(this.state.f2) + parseInt(this.state.f3) + parseInt(this.state.f4) + parseInt(this.state.f5) +
                    parseInt(this.state.f6) + parseInt(this.state.f7) + parseInt(this.state.f8) + parseInt(this.state.f9) + parseInt(this.state.f10) +
                    parseInt(this.state.f11) + parseInt(this.state.f12) + parseInt(this.state.f13) + parseInt(this.state.f14) + 
                    parseInt(this.state.f15) + parseInt(this.state.f16) + parseInt(this.state.f17) + parseInt(this.state.f18) +
                    parseInt(this.state.f19) + parseInt(this.state.f20);

            let F = parseInt(this.state.i1)+parseInt(this.state.i2)+parseInt(this.state.i3)+parseInt(this.state.i4)+parseInt(this.state.i5)+parseInt(this.state.i6)+parseInt(this.state.i7)+parseInt(this.state.i8)+
                    parseInt(this.state.i9)+parseInt(this.state.i10)+parseInt(this.state.i11)+parseInt(this.state.i12)+parseInt(this.state.i13)+parseInt(this.state.i14)+parseInt(this.state.i15)+parseInt(this.state.i16)+
                    parseInt(this.state.i17)+parseInt(this.state.i18)+parseInt(this.state.i19)+parseInt(this.state.i20);

            let tmortalidad=E/F;
                   
            let trecuperacion = 1 - tmortalidad;
            let pis = parseInt(this.state.poblacion) - (parseInt(this.state.i20)+parseInt(this.state.r20)+parseInt(this.state.f20));               
            this.setState({show:true});

            EnviarDatos(this.state.i20,
                    this.state.f20,
                    this.state.r20,
                    tasai,
                    trecuperacion,
                    tmortalidad,
                    pis,
                    this.state.fechaActual,
                    this.state.fechaInicio,
                    this.state.fechaFin,
                    this.state.municipio
                    ).then(response => {
                        console.log("Success ========>", response);     
                        this.props.history.push("/Graficos")                   
                    }).catch(error => {
                        console.log("Error ========>", error);
                        this.setState({show:false,show1:true})                      
                    })        
    }      

    handleAclick = (e, titleProps) => {
        const { index } = titleProps
        const { activeIndex } = this.state
        const newIndex = activeIndex === index ? -1 : index
    
        this.setState({ activeIndex: newIndex })
    }

    render(){
        const showModal=()=>{this.setState({show:false,show1:false})}
        const { activeIndex } = this.state;
        console.log("se esta renderizando");
        return(        
            <div>
                  <form id="form" className="formulario">
                <div className="formularioDiv">
                    <div className="titulo" align="center">
                        <h1 style={{backgroundColor:"#7cc4ee"}}>INSERTAR LOS DATOS HISTORICOS DE LA SIMULACION</h1>                                            
                        <div style={{fontSize:"17px",backgroundColor:"#dadddd",marginTop:"1.5vh"}}><b>Introduzca datos de infectados, recuperados y fallecidos sumados de 20 dias</b></div>
                    </div>
                    <div className='form'>
                    <Grid columns={3} divided>
                        <GridColumn>
                        <div className="Infectados" align="center" >
                            <h2 className="input-titles">Datos Historicos de Infectados</h2>                            
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i1" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i2" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i3" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i4" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i5" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>    
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i6" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                       
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i7" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i8" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i9" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i10" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i11" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i12" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>    
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i13" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i14" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i15" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i16" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i17" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i18" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i19" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="i20" placeholder="infectados" onChange={(e)=>this.handleState(e)} required focus/><br/>                                        
                        </div>
                    </GridColumn>
                    <GridColumn>
                        <div className="Recuperados" align="center" >
                            <h2 className="input-titles">Datos Historicos de Recuperados</h2>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r1" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r2" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r3" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r4" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r5" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r6" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r7" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r8" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r9" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r10" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r11" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r12" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r13" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r14" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                       
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r15" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r16" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r17" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r18" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r19" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="r20" placeholder="recuperados" onChange={(e)=>this.handleState(e)} required focus/><br/>                            
                        </div>
                    </GridColumn>
                    <GridColumn>
                        <div className="Fallecidos" align="center">
                            <h2 className="input-titles">Datos Historicos de Fallecidos</h2>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f1" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f2" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f3" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f4" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f5" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f6" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f7" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f8" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f9" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f10" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f11" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f12" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f13" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f14" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f15" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f16" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f17" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f18" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f19" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                        
                            <Input className="inp" type="number" style={{margin:"-9px"}} name="f20" placeholder="fallecidos" onChange={(e)=>this.handleState(e)} required focus/><br/>                            
                        </div>
                    </GridColumn>                    
                    </Grid>
                    </div>    
                </div>
            <Modals
                show={this.state.show}
                onHide={showModal}
                msg="Espere un momento..."
                f={<Loader active={true} inline size="massive"/>}
            />
            <Modals
                show={this.state.show1}
                onHide={showModal}
                msg="Introduzca todos los datos correctamente"
                unlock={true}
            />
            </form>  
            <div style={{backgroundColor:"#7cc4ee",marginBottom:"10px"}}>          
            <Grid columns={2} doubling>
                <GridColumn align="center">
                    <div  >                        
                        <Accordion>
                            <Accordion.Title
                            active={activeIndex === 0}
                            index={0}
                            onClick={this.handleAclick}
                            style={{fontSize:"25px"}}
                            >
                            <Icon name='dropdown' />
                            Introduzca el nombre del municipio:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 0} style={{fontSize:"20px",marginTop:'-20px'}}>
                                <p>
                                    Para tener registro de cada region del pais
                                </p>
                            </Accordion.Content>  
                        </Accordion>
                        <Input type="text"  name="municipio" placeholder="municipio" onChange={(e)=>this.handleState(e)} required icon="flag" focus/><br/>  
                        
                        <Accordion>
                            <Accordion.Title
                            active={activeIndex === 1}
                            index={1}
                            onClick={this.handleAclick}
                            style={{fontSize:"25px"}}
                            >
                            <Icon name='dropdown' />
                                Introduzca la poblacion total del Municipio:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 1} style={{fontSize:"20px",marginTop:'-20px'}}>
                                <p>
                                    Ultima vez censado
                                </p>
                            </Accordion.Content>  
                        </Accordion>                        
                        <Input type="number"  name="poblacion" placeholder="poblacion" onChange={(e)=>this.handleState(e)} required icon="group" focus/><br/>                        
                
                    </div>
                </GridColumn>
                <GridColumn align="center">
                    <div >
                    <Accordion>
                            <Accordion.Title
                            active={activeIndex === 2}
                            index={2}
                            onClick={this.handleAclick}
                            style={{fontSize:"25px"}}
                            >
                            <Icon name='dropdown' />
                            Introduzca la fecha del ultimo dato registrado:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 2} style={{fontSize:"20px",marginTop:'-20px'}}>
                                <p>
                                    La fecha del ultimo dato registrado oficialmente para la base de datos
                                </p>
                            </Accordion.Content>  
                        </Accordion>                 
                         <Input type="date"  name="fechaActual" placeholder="fecha" onChange={(e)=>this.handleState(e)} required/><br/>

                         <Accordion>
                            <Accordion.Title
                            active={activeIndex === 3}
                            index={3}
                            onClick={this.handleAclick}
                            style={{fontSize:"25px"}}
                            >
                            <Icon name='dropdown' />
                                Introduzca la fecha de inicio de la simulacion:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 3} style={{fontSize:"20px",marginTop:'-20px'}}>
                                <p>
                                    La fecha en la que quiere que se muestre los graficos
                                </p>
                            </Accordion.Content>  
                        </Accordion>                  
                        <Input type="date"  name="fechaInicio" placeholder="fecha" onChange={(e)=>this.handleState(e)} required/><br/>
                        
                    </div>
                </GridColumn>
            </Grid>
                <div align="center" >
                        <Accordion>
                            <Accordion.Title
                            active={activeIndex === 4}
                            index={4}
                            onClick={this.handleAclick}
                            style={{fontSize:"25px"}}
                            >
                            <Icon name='dropdown' />
                                Introduzca la fecha fin de la simulacion:
                            </Accordion.Title>
                            <Accordion.Content active={activeIndex === 4} style={{fontSize:"20px",marginTop:'-20px'}}>
                                <p>
                                    Fecha hasta el dia que quiere que se vea en los graficos
                                </p>
                            </Accordion.Content>  
                        </Accordion>      
               
                <Input type="date"  name="fechaFin" placeholder="fecha" onChange={(e)=>this.handleState(e)} required/><br/>
                
            </div>
            </div>    
            <div style={{backgroundColor:"#dadddd"}}>
                <button style={styles.box} className='button button1' onClick={()=>this.simular()}>iniciar</button>
               
            </div>  
            <Divider/>     
            <Divider/>
            
        </div>
        );        
    }    
}


