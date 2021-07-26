

export const infectados=(fechaI,fechaF)=>{
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
    
    return this.setState({
        chartData:newState,
        totalContagios:parseInt(totalContagios),
        totalFallecimientos:parseInt(totalFallecimientos),
        totalRecuperaciones:parseInt(totalRecuperaciones),

    })
    }else{
        return this.setState({
            show1:true
        })
    }
}   