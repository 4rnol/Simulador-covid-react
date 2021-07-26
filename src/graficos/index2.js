import React,{useEffect, useState} from 'react';
import {Input, Divider, Table, Checkbox,Loader} from 'semantic-ui-react';
import Accordeon from '../Components/Accordion';
import Modals from '../Components/modals';
import Grapichs from './graficos.js';
import {Modal,Button} from 'react-bootstrap';
import Labels from './labels.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './style.css';
import {RecibirDatos} from '../api';
import {Chart} from './grapichComponents/chart';

const Graficos=()=>{
    
    const [state,setState]=useState({
        showG1:true,
        show:false,
        show1:false,
        show2:false,
        tasaRecuperacion:0,
        tasaMortalidad:0,
        tasaInteraccion:0,
        tmIterable:0,
        trIterable:0,
        tiIterable:0,
        
        valT:0,
        val:0,
        valAu:0,
        valMor:0,
        probabilidadContagio:0,
        diasHospitalizacion:14,
        fechaActual:0,
        fechaInicio:0,
        fechaFin:0,
        municipio:'',
        fechaiNu:0,
        fechafNu:0,
        susceptiblesini:0,
        infectadosinicial:0,
        recuperadosini:0,
        fallecidosini:0,
        
        isChecked1: false,
        isChecked2: false,
        isChecked3: false,

        recibe:[null],
        
        totalContagios:0,
        totalRecuperaciones:0,
        totalFallecimientos:0,
        array1: [],
        //Object for chart
        
    });
    

    useEffect(()=>{
    RecibirDatos()
            .then(({data})=>{
                
                setState({
                    ...state,
                    recibe:data,
                    tasaMortalidad:data[data.length-1].TasaMortalidad,
                    tasaRecuperacion:data[data.length-1].TasaRecuperacion,
                    tasaInteraccion:data[data.length-1].tasaInteraccion,
                    probabilidadContagio:data[data.length-1].probabilidadContagio,                    
                    fechaActual:data[data.length-1].fechaActual,
                    fechaInicio:data[data.length-1].fechaInicio,
                    fechaFin:data[data.length-1].fechaFin,                    
                    susceptiblesini:data[data.length-1].poblacionInicialSusc,
                    infectadosinicial:data[data.length-1].infectadosinicial,
                    recuperadosini:data[data.length-1].recuperadosini,
                    fallecidosini:data[data.length-1].fallecidosini,
                    municipio:data[data.length-1].municipio,                    
                    trIterable:data[data.length-1].TasaRecuperacion,
                    tmIterable:data[data.length-1].TasaMortalidad,
                    tiIterable:data[data.length-1].tasaInteraccion
                });
             })
    },[]);
   


    
    return(
        <div>  
            <Chart municipio="Cercado" data={state.recibe}/>          
        </div> 
    );
} 

export default Graficos;