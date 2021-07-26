import React from 'react';
import { Line } from 'react-chartjs-2';

 const Grapichs=({data,municipio})=>{
    return(
        <Line
                            data={data}
                            width={700}
                            height={700}
                            
                            options={
                                {
                                responsive:true,
                                maintainAspectRatio:false,
                                title: {
                                    display: true,
                                    text: 'Datos del Municipio de '+municipio,
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
export default Grapichs;