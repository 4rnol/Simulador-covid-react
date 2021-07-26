import React, {useState,useEffect} from 'react';
import { Line } from 'react-chartjs-2';
import {infectados} from "./infectados";

export const Chart=({municipio,data})=>{
    console.log(data[0]);
    const [char,setChar]=useState({
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
    });
    useEffect(() => {
        // infectados();        
    }, [])
    return(
        
            <Line
                data={char}
                width={700}
                height={700}
                
                options={
                    {
                    responsive:true,
                    maintainAspectRatio:false,
                    title: {
                        display: true,
                        text:`Datos del Municipio de ${municipio}`,
                        fontSize:50,
                        position:'top'
                    },
                    legend: {
                        display: true,
                        position:'bottom',                                
                        labels: {
                            padding:20,
                            fontSize:20
                        }
                    },
                    scales: {                                
                        yAxes: [                                    
                            {
                                scaleLabel: {
                                    display: true,
                                    labelString: 'POBLACION',
                                    fontSize:25,
                                    padding:1
                                },
                            ticks: {
                                fontSize:17                                                                            
                                }
                            }
                        ],
                        xAxes: [
                            {
                                
                            ticks: {
                                fontSize:15
                                    }
                                }
                            ]
                        }
                    }
                }
            
            />
        
    );
}