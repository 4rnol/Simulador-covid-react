import axios from 'axios';

const EnviarDatos=async(ii,fi,ri,ti,tr,tm,pis,fechaActual,fechaInicial,fechaFin,municipio)=>{      
            
    await axios({
        method: 'POST',              
        url: 'https://taller-simu.herokuapp.com/enviardatos',
        data: {
            infectadosinicial:ii,
            fallecidosini:fi,
            recuperadosini:ri,
            probabilidadContagio:0.12,
            
            tasaInteraccion:ti,
            TasaRecuperacion:tr,
            TasaMortalidad:tm,

            fechaActual:fechaActual,
            fechaInicio:fechaInicial,
            fechaFin:fechaFin,                    

            poblacionInicialSusc:pis,                    
            municipio:municipio
        }
    }); 
}  

const RecibirDatos=async()=>{
    const url=`https://taller-simu.herokuapp.com/allData`;
    
    return await axios(url, {method: 'GET'});
}
export {
    EnviarDatos,
    RecibirDatos
};