import React, { Component } from 'react';
import {Input, Divider, Table, Checkbox,Loader} from 'semantic-ui-react';
import Accordeon from '../Components/Accordion';
import axios from 'axios';
import Modals from '../Components/modals';
import Grapichs from './graficos.js';
import {Modal,Button} from 'react-bootstrap';
import Labels from './labels.js';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './style.css';

class Graficos extends Component{
    constructor(props) {
        super(props);
        this.toggle= this.toggle.bind(this);
        
        this.state = { 
            
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

            recibe:[],
            
            totalContagios:0,
            totalRecuperaciones:0,
            totalFallecimientos:0,
            array1: [],
            //Object for chart
            chartData:{
                labels:[],
                datasets:[
                {
                    label:'Infectados',
                    data:[],
                    borderColor:'#FFC300',
                    fill:false,
                    pointBorderWidth:1,
                    pointHoverRatios:4,
                    borderWidth:3
                    
                },
                {
                    label:'Recuperados',
                    data:[],
                    borderColor:"#4c851e",
                    fill:false,
                    pointBorderWidth:1,
                    pointHoverRatios:4,
                    borderWidth:3
                },
                {
                    label:'Fallecidos',
                    data:[],
                    borderColor:"#97141A",
                    fill:false,
                    pointBorderWidth:1,
                    pointHoverRatios:4,
                    borderWidth:3         
                    
                }
            ]
            
            }
        };  
    }
        
    componentDidMount=async()=>{
        this.setState({show2:true})
        await this.fetchData(); 
        this.infectados(this.state.fechaInicio,this.state.fechaFin);
        
    }
    fetchData = async ()=>{
        
        await axios('https://taller-simu.herokuapp.com/allData', {method: 'GET'})        
        .then(({data}) => {       
            this.setState({
                recibe:data,         
                tasaRecuperacion:data[data.length-1].TasaRecuperacion,
                tasaMortalidad:data[data.length-1].TasaMortalidad,
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
                tiIterable:data[data.length-1].tasaInteraccion,
                show2:false
            })

        })       
    }    
    
    infectados=(fechaI,fechaF)=>{
        if(fechaI>=this.state.fechaActual && fechaF>=fechaI){
            
        let susceptibles = parseInt(this.state.susceptiblesini);
        let infectados = parseInt(this.state.infectadosinicial);
        let recuperados = parseInt(this.state.recuperadosini);
        let fallecidos = parseInt(this.state.fallecidosini)
        let diash = parseInt(this.state.diasHospitalizacion);
        let proContagio = this.state.probabilidadContagio;
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let totalContagios=0, totalRecuperaciones=0,totalFallecimientos=0;        
        let mortalidad = this.state.tmIterable;
        let tinteraccion=this.state.tiIterable;

        let days=this.totalDays(fechaI,fechaF);
        let diasMostrar=this.countDays(fechaI,fechaF);

        let thischart=this.state.chartData.datasets[0];
        let thischart1=this.state.chartData.datasets[1];
        let thischart2=this.state.chartData.datasets[2];
        let initialState=this.state.chartData;
        let newData1=[];
        let newData2=[];
        let newData3=[];
        let labels=[];
            for(let i=1 ; i<=days+1 ; i++){              
                
                if((days-diasMostrar)<i){
                    if(this.state.showG1===false){
                        newData1.push(parseInt(contagios));
                        newData2.push(parseInt(recuperaciones));
                        newData3.push(parseInt(fallecimientos));
                        labels.push(this.calcFecha(i));      
                    }else{
                        newData1.push(parseInt(infectados));
                        newData2.push(parseInt(recuperados));
                        newData3.push(parseInt(fallecidos));
                        labels.push(this.calcFecha(i)); 
                    }          
                }
                contagios = (infectados * tinteraccion * susceptibles) / (susceptibles+infectados+recuperados) * proContagio;
                recuperaciones = infectados * tRecuperacion / diash;
                fallecimientos = infectados * mortalidad / diash;
                susceptibles = susceptibles - contagios;
                infectados = infectados + contagios - recuperaciones - fallecimientos;
                recuperados = recuperados + recuperaciones;
                fallecidos = fallecidos + fallecimientos; 

                totalContagios=totalContagios+contagios;                
                totalRecuperaciones=totalRecuperaciones+recuperaciones;
                totalFallecimientos=totalFallecimientos+fallecimientos;             
            }

        let newDataSet={
            ...thischart
        }
        let newDataSet1={
            ...thischart1
        }
        let newDataSet2={
            ...thischart2
        }
        initialState.labels=labels;
        newDataSet.data=newData1;
        newDataSet1.data=newData2;
        newDataSet2.data=newData3;
        
        let newState={
            ...initialState,datasets:[newDataSet,newDataSet1,newDataSet2]
        }           
        
        this.setState({
            chartData:newState,
            totalContagios:parseInt(totalContagios),
            totalFallecimientos:parseInt(totalFallecimientos),
            totalRecuperaciones:parseInt(totalRecuperaciones),

        })
        }else{
            this.setState({
                show1:true
            })
        }
    }   
        
    
    totalDays=(fechaI,fechaF)=>{
        
        let fechaini=new Date(this.state.fechaActual).getTime();
        let fechaf=new Date(fechaF).getTime();
        let diasTotales = (fechaf - fechaini)/(1000*60*60*24);
       
        return diasTotales;
    }

    countDays=(fechaini,fechafin)=>{
        let fechaI=new Date(fechaini).getTime();
        let fechaF=new Date(fechafin).getTime();
        let diff=(fechaF-fechaI)/(1000*60*60*24);
        
        return diff;        
    }

    calcFecha = (i) => {
        let date=new Date(this.state.fechaActual);
        date.setDate(date.getDate()+i);
        let res = date.toLocaleDateString('es-MX', {
            day : 'numeric',
            month : 'short',
            year : 'numeric'
        }).split(' ').join(' ');
        return res;
        
    }
    toggleChange1 = () => {
        this.setState({
            isChecked1:!this.state.isChecked1
        })  
    }
    
    isDisabled = () =>this.state.isChecked1?false:true;
    
    forIteration=(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)=>{

        let obj=[[],[],[]];
        let thischart=this.state.chartData.datasets[0];
        let thischart1=this.state.chartData.datasets[1];
        let thischart2=this.state.chartData.datasets[2];
        let initialState=this.state.chartData;

        let susceptibles = parseInt(this.state.susceptiblesini);
        let infectados = parseInt(this.state.infectadosinicial);
        let recuperados = parseInt(this.state.recuperadosini);
        let diash=parseInt(this.state.diasHospitalizacion);
        let fallecidos = parseInt(this.state.fallecidosini);
        let proContagio = this.state.probabilidadContagio;
        let totalDays=this.totalDays(fini,ffin);
        let days=this.countDays(fini,ffin);
        let totalContagios=0, totalRecuperaciones=0,totalFallecimientos=0;
        
        for(let i=1;i<=totalDays+1;i++){
            if((totalDays-days)<i){
                if(this.state.showG1===false){
                    obj[0].push(parseInt(contagios));
                    obj[1].push(parseInt(recuperaciones));
                    obj[2].push(parseInt(fallecimientos));
                }
                else{
                    obj[0].push(parseInt(infectados));
                    obj[1].push(parseInt(recuperados));
                    obj[2].push(parseInt(fallecidos));
                                          
                }
            }
            contagios = (infectados * tinteraccion * susceptibles) / (susceptibles + infectados + recuperados) * proContagio;
            recuperaciones = infectados * tRecuperacion / diash;
            fallecimientos = infectados * mortalidad / diash;
            susceptibles = susceptibles - contagios;
            infectados = infectados + contagios - recuperaciones - fallecimientos;
            recuperados = recuperados + recuperaciones;
            fallecidos = fallecidos + fallecimientos;

            totalContagios=totalContagios+contagios;
            totalRecuperaciones=totalRecuperaciones+recuperaciones;
            totalFallecimientos=totalFallecimientos+fallecimientos;
        }
        let newDataSet={
            ...thischart
        }
        let newDataSet1={
            ...thischart1
        }
        let newDataSet2={
            ...thischart2
        }
        newDataSet.data=obj[0];
        newDataSet1.data=obj[1];
        newDataSet2.data=obj[2]; 
        let newState={
            ...initialState,datasets:[newDataSet,newDataSet1,newDataSet2]
        }   
        this.setState({
            totalContagios:parseInt(totalContagios),
            totalFallecimientos:parseInt(totalFallecimientos),
            totalRecuperaciones:parseInt(totalRecuperaciones)
        })
        return newState;
    }
    verifyDatesi=()=>this.state.fechaiNu!==0?this.state.fechaiNu:this.state.fechaInicio;
    
    verifyDatesf=()=>this.state.fechaiNu!==0?this.state.fechafNu:this.state.fechaFin;

    toggleChange2 = () => {
        let hist=this.state.tiIterable;
        let valor=this.state.valT;
        let fini=this.verifyDatesi();
        let ffin=this.verifyDatesf();
        if(!this.state.isChecked2){      
            let tRecuperacion = this.state.trIterable;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = this.state.tmIterable;
            hist=hist+valor;
            valor=0.2;
            let tinteraccion=hist-valor;
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            this.setState({                
                isChecked2: !this.state.isChecked2,
                tiIterable: tinteraccion,
                isChecked3:false,
                valT:valor,
                chartData:newState               
            })      
            
        }
        else{           
            let tRecuperacion = this.state.trIterable;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = this.state.tmIterable;
            hist=hist+valor;
            valor=0
            let tinteraccion=hist+valor;
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState((state)=>({
                isChecked2: !state.isChecked2,
                tiIterable: tinteraccion,
                valT:valor,
                chartData:newState
                                 
            }));        
        }
    }

    toggleChange3 = () => {
        let hist=this.state.tiIterable;
        let valor=this.state.valT;
        let fini=this.verifyDatesi();
        let ffin=this.verifyDatesf();
        if(!this.state.isChecked3){            
            let tRecuperacion = this.state.trIterable;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = this.state.tmIterable;
            hist=hist+valor;
            valor=0.13;
            let tinteraccion=hist-valor;

            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState({                
                isChecked3: !this.state.isChecked3,
                tiIterable: tinteraccion,
                isChecked2:false,
                valT:valor,
                chartData:newState 
            })                  
        }else{              
            let tRecuperacion = this.state.trIterable;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = this.state.tmIterable;
            hist=hist+valor;
            valor=0;
            let tinteraccion=hist+valor;                
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            this.setState({
                isChecked3: !this.state.isChecked3,
                tiIterable: tinteraccion,
                valT:valor,
                chartData:newState                                      
            })                
        }        
    }

    automedication=(value)=>{
        let histM=this.state.tmIterable;
        let histR=this.state.trIterable;
        let val=this.state.valAu;
        let fini=this.verifyDatesi();
        let ffin=this.verifyDatesf();
        if(value==="todos"){
            histM=histM+val;
            histR=histR-val;
            val=0.01;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState                
            })
            this.setState({
                chartData:newState              
            })
        }
        if(value==="muchos"){            
           
            histM=histM+val;
            histR=histR-val;
            val=0.005;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;

            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState               
            })
        }
        if(value==="algunos"){
            histM=histM+val;
            histR=histR-val;
            val=0.004;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState              
            })
        }
        if(value==="pocos"){            
           
            histM=histM+val;
            histR=histR-val;
            val=0.003;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;

            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState               
            })
        }
        if(value==="ninguno"){
            histM=histM+val;
            histR=histR-val;
            val=0.001;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState              
            })
        }
        if(value==="0"){
            histM=histM+val;
            histR=histR-val;
            val=0;
            let tRecuperacion = histR+val;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = histM-val;
            let tinteraccion=this.state.tiIterable;            
           
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
            
            this.setState({                
                tmIterable:mortalidad,
                valAu:val,
                trIterable: tRecuperacion,
                chartData:newState            
            })
        }
    }
    socialDistancing=(value)=>{
        
        let tSocial=this.state.tiIterable;
        let valor=this.state.val;
        let fini=this.verifyDatesi();
        let ffin=this.verifyDatesf();
        if(value==="todos"){        
            let tRecuperacion = this.state.trIterable;
            let recuperaciones,contagios,fallecimientos;
            let mortalidad = this.state.tmIterable;            
            tSocial=tSocial+valor;
            valor=0.14;
            let tinteraccion=tSocial-valor;
            
            let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
            
            this.setState({                
                tiIterable:tinteraccion,
                val:valor,
                chartData:newState                         
            })
    }
    if(value==="muchos"){
        
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = this.state.tmIterable;       
        tSocial=tSocial+valor;
        valor=0.1;
        let tinteraccion=tSocial-valor;     
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        
        this.setState({                
            tiIterable:tinteraccion,
            val:valor,
            chartData:newState            
        })                  
    
    }
    if(value==="algunos"){        
        
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = this.state.tmIterable;
        tSocial=tSocial+valor;
        valor=0.05;
        let tinteraccion=tSocial-valor;
       
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
        this.setState({                
            tiIterable:tinteraccion,
            val:valor ,
            chartData:newState              
        })                  
    }
    if(value==="pocos"){
        
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = this.state.tmIterable;
        tSocial=tSocial+valor;
        valor=0.01;
        let tinteraccion=tSocial-valor;
        
        
        
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
        
        this.setState({                
            tiIterable:tinteraccion,
            val:valor,
            chartData:newState             
        })
    }
    if(value==="ninguno"){
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = this.state.tmIterable;
        tSocial=tSocial+valor;
        valor=0.001;
        let tinteraccion=tSocial-valor;
       
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin);
        this.setState({                
            tiIterable:tinteraccion,
            val:valor,
            chartData:newState            
        })
    }
    if(value==="0"){
        let tRecuperacion = this.state.trIterable;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = this.state.tmIterable;
        tSocial=tSocial+valor
        valor=0;
        let tinteraccion=tSocial+valor;

        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        
        this.setState({                
            tiIterable:tinteraccion,
            val:valor,
            chartData:newState           
        })
        }
    }
    handleState = (event) => {
        this.setState({
            [event.target.name]: (event.target.value)
        })
    }
    Mods=(props)=> {
        const data=this.state.chartData;        
        return (
          <Modal
            {...props}
            size="me"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                {this.state.municipio}
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <Table celled fixed unstackable="true" textAlign="center">
                <Table.Header>
                <Table.Row>
                    <Table.HeaderCell>Fecha</Table.HeaderCell>
                    <Table.HeaderCell>{this.state.chartData.datasets[0].label}</Table.HeaderCell>
                    <Table.HeaderCell>{this.state.chartData.datasets[1].label}</Table.HeaderCell>
                    <Table.HeaderCell>{this.state.chartData.datasets[2].label}</Table.HeaderCell>
                </Table.Row>
                </Table.Header>

                <Table.Body>
                              
                    {
                        data.labels.map((it,index)=>(
                        <Table.Row>   
                        <Table.Cell key={index}>{it}</Table.Cell>
                        <Table.Cell>{data.datasets[0].data[index]}</Table.Cell>      
                        <Table.Cell >{data.datasets[1].data[index]}</Table.Cell>
                        <Table.Cell >{data.datasets[2].data[index]}</Table.Cell>                                  
                        </Table.Row>
                        ))             
                        
                    }
                    <Table.Row>
                
                </Table.Row>
                </Table.Body>
            </Table>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={()=>this.toggle()}>Cerrar</Button>
            </Modal.Footer>
          </Modal>
        );
    }
    
    vaciarChart=()=>{
        let thischart=this.state.chartData.datasets[0];
        let thischart1=this.state.chartData.datasets[1];
        let thischart2=this.state.chartData.datasets[2];        
        var initialState=this.state.chartData;        
        
        let newDataSet={
            ...thischart
        }
        let newDataSet1={
            ...thischart1
        }
        let newDataSet2={
            ...thischart2
        }
        initialState.labels=[];
        
        newDataSet.data=[];
        newDataSet1.data=[];
        newDataSet2.data=[];
            
        let newState={
            ...initialState,datasets:[newDataSet,newDataSet1,newDataSet2]
        } 
           
        this.setState({
            chartData:newState              
        })        
    }  
      
    toggle=()=>{        
        this.setState({ show: !this.state.show }); 
    }

    hospitalQuality=(value)=>{
        let histM=this.state.tmIterable;
        let histR=this.state.trIterable;
        let val=this.state.valMor;
        let fini=this.verifyDatesi();
        let ffin=this.verifyDatesf();      
        if(value==="excelente"){  
                let recuperaciones,contagios,fallecimientos;
                histM=histM+val;
                histR=histR-val;
                val=0.01;
                let tRecuperacion = histR+val;
                let mortalidad = histM-val;
                let tinteraccion=this.state.tiIterable;
                
                let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
                this.setState({                
                    tmIterable:mortalidad,
                    valMor:val,
                    trIterable: tRecuperacion,
                    chartData:newState                
                })
    }
        if(value==="buena"){
        
           
                histM=histM+val;
                histR=histR-val;
                val=0.008;
                let tRecuperacion = histR+val;
                let recuperaciones,contagios,fallecimientos;
                let mortalidad = histM-val;
                let tinteraccion=this.state.tiIterable;
                
                let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
                this.setState({                
                    tmIterable:mortalidad,
                    valMor:val,
                    trIterable: tRecuperacion,
                    chartData:newState               
                })
    }
    if(value==="regular"){      
        
        histM=histM+val;
        histR=histR-val;
        val=0.005;
        let tRecuperacion = histR+val;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = histM-val;
        let tinteraccion=this.state.tiIterable;
       
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        this.setState({                
            tmIterable:mortalidad,
            valMor:val,
            trIterable: tRecuperacion,
            chartData:newState               
        })
    }
    if(value==="mala"){
        histM=histM+val;
        histR=histR-val;
        val=0.001;
        let tRecuperacion = histR+val;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = histM-val;
        let tinteraccion=this.state.tiIterable;
        
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        
        this.setState({                
            tmIterable:mortalidad,
            valMor:val,
            trIterable: tRecuperacion,
            chartData:newState                
        })
    }
    if(value==="pesima"){
     
        histM=histM+val;
        histR=histR-val;
        val=0.00001;
        let tRecuperacion = histR+val;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = histM-val;
        let tinteraccion=this.state.tiIterable;
       
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        
        this.setState({                
            tmIterable:mortalidad,
            valMor:val,
            trIterable: tRecuperacion,
            chartData:newState               
        })
    }

    if(value==="0"){
        histM=histM+val;
        histR=histR-val;
        val=0.0000;
        let tRecuperacion = histR+val;
        let recuperaciones,contagios,fallecimientos;
        let mortalidad = histM-val;
        let tinteraccion=this.state.tiIterable;
        
        let newState=this.forIteration(tRecuperacion,recuperaciones,contagios,fallecimientos,mortalidad,tinteraccion,fini,ffin)
        this.setState({                
            tmIterable:mortalidad,
            valMor:val,
            trIterable: tRecuperacion,
            chartData:newState               
        })
    
        }
    }
    changeMunicipality=async(value)=>{
        value=parseInt(value);
        let allData=this.state.recibe;    
        
        let municipio=allData.find((post) =>(post.id === value));     

        await this.establecerstate(municipio.TasaRecuperacion,municipio.TasaMortalidad,municipio.tasaInteraccion,municipio.probabilidadContagio,municipio.fechaActual,
            municipio.fechaInicio,municipio.fechaFin,municipio.poblacionInicialSusc,municipio.infectadosinicial,municipio.recuperadosini,municipio.fallecidosini,
            municipio.municipio);
            
        this.infectados(this.state.fechaInicio,this.state.fechaFin);       
    }

    establecerstate=(tr,tm,ti,pc,fa,fi,ff,pis,ii,ri,fallecidosi,m)=>{
        this.setState({
            tasaRecuperacion:tr,
            tasaMortalidad:tm,
            tasaInteraccion:ti,
            probabilidadContagio:pc,
            fechaActual:fa,
            fechaInicio:fi,
            fechaFin:ff,
            poblacionInicialSusc:pis,
            infectadosinicial:ii,
            recuperadosini:ri,
            fallecidosini:fallecidosi,
            municipio:m,
            susceptiblesini:pis,
            trIterable:tr,
            tmIterable:tm,
            tiIterable:ti,


        });        
    }
    click=async()=>{
        if(this.state.showG1===!false){
            this.state.chartData.datasets[0].label="Contagios";
            this.state.chartData.datasets[1].label="Recuperaciones";
            this.state.chartData.datasets[2].label="Fallecimientos";
        }else{
            this.state.chartData.datasets[0].label="Infectados";
            this.state.chartData.datasets[1].label="Recuperados";
            this.state.chartData.datasets[2].label="Fallecidos";
        }
        await this.setState({
            showG1:!this.state.showG1
        })        
        this.vaciarChart();
        this.infectados(this.state.fechaInicio,this.state.fechaFin);
        
    }

    handleState =async(event) => {
        await this.setState({
            [event.target.name]: (event.target.value)                        
        });
        this.infectados(this.state.fechaInicio,this.state.fechaFin);
    }
    
    onPrint = () => {
        const doc = new jsPDF();
        doc.setFont('courier');
        doc.setFontSize(20);
        doc.text(this.state.municipio, 85, 14);
        doc.setFontSize(15);
        doc.text("Tasa de interaccion: "+this.state.tiIterable,15,28);
        doc.text("Tasa de recuperacion: "+this.state.trIterable,15,34);
        doc.text("Tasa de mortalidad: "+this.state.tmIterable,15,40);
        doc.text("Probabilidad de contagi: "+this.state.probabilidadContagio,15,46);
        doc.text("Dias de hospitalizacion promedio: "+this.state.diasHospitalizacion,15,52);
        // define the columns we want and their titles
        const tableColumn = ["Fecha", this.state.chartData.datasets[0].label, this.state.chartData.datasets[1].label, this.state.chartData.datasets[2].label];
        // define an empty array of rows
        const tableRows = [];
        this.state.chartData.labels.forEach((data,index)=>{
            const RowData=[
                this.state.chartData.labels[index],
                this.state.chartData.datasets[0].data[index],
                this.state.chartData.datasets[1].data[index],
                this.state.chartData.datasets[2].data[index]
            ];
            tableRows.push(RowData);
        })          
        doc.autoTable(tableColumn, tableRows, { startY: 60 });    
        // we def{ine the name of our PDF file.
        doc.save(this.state.municipio+".pdf");
    };

    render(){
        const data=this.state.recibe;
        const fechaI=new Date(this.state.fechaActual);
        const fechaA=(fechaI.getDate()+1)+"-"+(fechaI.getMonth()+1)+"-"+fechaI.getFullYear();
        let showModal=()=>this.setState({show:false,show1:false,show2:false})
        let ti=this.state.tiIterable;
        let tr=this.state.trIterable;
        let tm=this.state.tmIterable;
        let si=this.state.susceptiblesini;
        let ii=this.state.infectadosinicial;
        let ri=this.state.recuperadosini;
        let fi=this.state.fallecidosini;
        let fechaa=this.state.fechaActual;
        let fechai=this.state.fechaInicio;
        let fechaf=this.state.fechaFin;
        let procon=this.state.probabilidadContagio;
        let dh=this.state.diasHospitalizacion;
        console.log("se esta renderizando");
        
        return(
            <div >
                <div style={{backgroundColor: "#7cc4ee",marginBottom:"1.6vh"}}>
                <label className="" style={{fontSize:"25px"}}>Municipios que cuentan con registros y las fechas en las que se registraron los datos: </label>
                <select id="municipio"  onChange={()=>this.changeMunicipality(document.getElementById("municipio").value)} >
                    <option value="0" selected disabled>Cambiar Municipio</option>
                    {
                        data.map((it)=>(
                            <option key={it.id} value={it.id}> {it.municipio} &nbsp;&nbsp; con fecha:&nbsp;&nbsp;&nbsp;&nbsp;{new Date(it.fechaActual).toLocaleDateString()}</option>
                            
                        ))
                    }
                </select>
                
                </div>
                {
                    this.state.showG1?
                    <div align="center">
                    <label style={{fontSize:"45px",fontWeight:"800"}}>GRAFICO DE POBLACION</label>
                    </div>
                    :<Labels
                        totalContagios={this.state.totalContagios}
                        totalRecuperaciones={this.state.totalRecuperaciones}
                        totalFallecimientos={this.state.totalFallecimientos}
                        maxContagios={Math.max(...this.state.chartData.datasets[0].data)}
                        maxRecuperaciones={Math.max(...this.state.chartData.datasets[1].data)}
                        maxFallecimientos={Math.max(...this.state.chartData.datasets[2].data)}
                    />             
                }
                
                <button className="btng btng1" style={{marginLeft:"40px"}} onClick={()=>this.click()}>Cambiar Grafico</button>
               
                <div  className="chart-container" style={{backgroundColor:""}}  > 
                <Grapichs 
                    
                    data={this.state.chartData}
                    municipio={this.state.municipio}
                />
                </div>                
                <button className="btng btng1" onClick={this.toggle} style={{marginLeft:"40px"}}>Mostrar reporte</button>
                <div align="center">
                <button className="btng btng1" onClick={()=>this.onPrint()} style={{marginLeft:"40px"}}>Crear PDF</button><br/>
                </div>
                <div className="grid-container" >    
                    
                        <div className="grid-item1" align="center" >                        
                            <Accordeon
                                title="Tasa de interaccion:"
                                indice={0}
                                content="medida"
                            />
                                <Input type="number" name="tiIterable"  value={ti || ''} onChange={(e)=>this.handleState(e)} />                            
                        </div>                                               
                        
                        <div className="grid-item2" align="center" >
                            <Accordeon
                                title="Tasa de recuperacion:"
                                indice={1}
                                content="Mide la cantidad de personas recuperadas sobre cierta
                                    cantidad de personas infectadas en determinado tiempo y espacio"
                            />                        
                            <Input type="number" name="trIterable" value={tr || ''} onChange={(e)=>this.handleState(e)} icon="heart"/>                            
                        </div>
                        
                        <div className="grid-item3" align="center" >
                        <Accordeon
                                title="Tasa de mortalidad:"
                                indice={2}
                                content="Mide la cantidad de personas fallecidas sobre cierta
                                cantidad de personas infectadas en determinado tiempo y espacio"
                        />                 
                            <Input type="number" name="tmIterable" value={tm || ''} onChange={(e)=>this.handleState(e)}/>                            
                        </div>
                        
                        <div className="grid-item4" align="center" >
                        <Accordeon
                                title="Probabilidad de contagio:"
                                indice={3}
                                content="Probabilidad de que salga contagiado al interactuar con una persona infectada"
                        />                          
                            <Input type="number" name="probabilidadContagio" value={procon || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>                                               
                    
                      
                        <div  className="grid-item5" align="center" >
                        <Accordeon
                                title="Poblacion inicial susceptible:"
                                indice={4}
                                content="Poblacion total menos todos aquellos que ya vencieron el covid de alguna u otra manera"
                        />                           
                            <Input type="number" name="susceptiblesini" value={si || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                        
                        <div  className="grid-item6" align="center" >
                        <Accordeon
                                title="Infectados iniciales:"
                                indice={5}
                                content="Cantidad de Infectados al inicio de la simulacion"
                        />    
                            <Input type="number" name="infectadosinicial" value={ii || ''} onChange={(e)=>this.handleState(e)} icon="add user"/>
                        </div>
                        
                        <div  className="grid-item7" align="center" >
                        <Accordeon
                                title="Recuperados iniciales:"
                                indice={6}
                                content="Cantidad de Recuperados al inicio de la simulacion"
                        />                            
                            <Input type="number" name="recuperadosini" value={ri || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                        
                        <div className="grid-item8" align="center" >
                        <Accordeon
                                title="Fallecidos iniciales:"
                                indice={7}
                                content="Cantidad de Fallecidos al inicio de la simulacion"
                        />                                                   
                            <Input type="number"  name="fallecidosini" value={fi || ''} onChange={(e)=>this.handleState(e)}/>                           
                        </div>
                      
                    
                        <div className="grid-item9" align="center" >
                        <Accordeon
                                title="Fecha inicio de la simulacion:"
                                indice={8}
                                content="Fecha en la que se comenzara a interactuar con datos, no las que se muestren en el grafico"
                        /> 
                        
                            <Input type="date" name="fechaActual" value={fechaa || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                        
                        <div className="grid-item10" align="center" >
                        <Accordeon
                                title="Fecha inicio del grafico:"
                                indice={9}
                                content="Fecha inicial del grafico para mostrar determinados periodos de simulacion"
                        />                         
                            <Input type="date" name="fechaInicio" value={fechai || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                        
                        <div className="grid-item11" align="center" >
                        <Accordeon
                                title="Fecha fin del grafico:"
                                indice={10}
                                content="Fecha hasta que se mostraran los datos "
                        /> 
                        
                            <Input type="date" name="fechaFin" value={fechaf || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                        
                        <div className="grid-item12"  align="center" >
                        <Accordeon
                                title="Dias hospitalizacion:"
                                indice={11}
                                content="Es la cantidad de dias promedio en la que un paciente de covid se cura o muere "
                        />                         
                            <Input type="number" name="diasHospitalizacion" value={dh || ''} onChange={(e)=>this.handleState(e)}/>
                        </div>
                    
                </div>
                <this.Mods
                    show={this.state.show}
                    onHide={showModal}                    
                />
                <Modals
                    show={this.state.show1}
                    onHide={showModal}
                    msg="LAS FECHAS TIENE QUE SER MAYORES A: "
                    f={fechaA}                
                />
                <Modals
                    show={this.state.show2}
                    onHide={showModal}
                    msg="Espere un momento..."
                    f={<Loader active={true} inline size="massive"/>}
                />    
                
                <div className="grid_container">
                    <div className='grid_item1'>
                            <div className="checkbox" align="center">                               
                                <Checkbox 
                                    toggle 
                                    label="Cuarentena" 
                                    checked={this.state.isChecked1} 
                                    onChange={this.toggleChange1}
                                    style={{fontSize:"25px"}}
                                />
                            </div>
                     
                            <div align="center">
                                
                                <Checkbox 
                                    toggle
                                    style={{fontSize:"20px"}}
                                    label="Rigida"                                    
                                    checked={this.state.isChecked2} 
                                    onChange={this.toggleChange2} 
                                    disabled={this.isDisabled()}
                                />
                            </div>

                            <div align="center">
                                
                                <Checkbox
                                    toggle
                                    style={{fontSize:"20px"}}
                                    label="Dinamica"
                                    checked={this.state.isChecked3} 
                                    onChange={this.toggleChange3} 
                                    disabled={this.isDisabled()}
                                />
                            </div>                      
                    </div>
                    <div className='grid_item2'>      
                        <div align="center">
                            <label className="" style={{fontSize:"18px",textAlign:"center"}}><b>En su localidad respetan el distanciamiento social:</b></label><br/>
                            </div>
                            <div align="center" style={{marginTop:"10px"}}>

                            <select id="cho"  onChange={()=>this.socialDistancing(document.getElementById("cho").value)} >
                                <option value="0" selected>Seleccione una Opcion</option>
                                <option value="todos">todos del 75% al 100%</option>
                                <option value="muchos">muchos del 50% al 75%</option>
                                <option value="algunos">algunos del 25% al 50%</option>
                                <option value="pocos">pocos del 0 al 25%</option>
                                <option value="ninguno">ninguno</option>
                            </select>
                        </div>
                    </div>
                    <div className='grid_item3'> 
                        <div>
                            <label className="" style={{fontSize:"18px",textAlign:"center"}}><b>Indique la cantidad de personas que se automedican:</b></label><br/>
                        </div>
                            <div align="center" style={{marginTop:"10px"}}>

                            <select id="select" onChange={()=>this.automedication(document.getElementById("select").value)} >
                                <option value="0" selected>Seleccione una Opcion</option>
                                <option value="todos">todos del 75% al 100%</option>
                                <option value="muchos">muchos del 50% al 75%</option>
                                <option value="algunos">algunos 25% al 50%</option>
                                <option value="pocos">pocos 0 al 25%</option>
                                <option value="ninguno">ninguno</option>
                            </select>
                            </div>
                    </div>
                    <div className='grid_item3'>
                        <div >
                            <label className="" style={{fontSize:"18px",textAlign:"center"}}><b>Cual es la calidad de los hospitales en su ciudad:</b></label><br/>
                        </div>
                        <div align="center" style={{marginTop:"10px"}}>

                        <select id="hq" onChange={()=>this.hospitalQuality(document.getElementById("hq").value)} >
                            <option value="0" selected>Seleccione una Opcion</option>
                            <option value="excelente">excelente</option>
                            <option value="buena">buena</option>
                            <option value="regular">regular</option>
                            <option value="mala">mala</option>
                            <option value="pesimo">pesimo</option>
                        </select>
                    </div>
                    </div>
                </div>
                <Divider/>  
                <Divider/>  
                   
            </div>
        );
    }
}
export default Graficos;