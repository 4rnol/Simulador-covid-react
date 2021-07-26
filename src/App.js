import React,{Component} from "react";
import { HashRouter, Switch, Route } from "react-router-dom";
import Start from "./start";
import Graficos from "./graficos";
import Header from './header';
import 'bootstrap/dist/css/bootstrap.min.css';

import Simular from "./simular";
import Graficos2 from "./graficos2";
import Footer from './footer';
class App extends Component {
  render(){
  return (
    <div>
      <HashRouter >        
        <div>     
            <Header />
            
        <Switch>
            <Route exact path="/" component={Start} />
            <Route path="/simular" component={Simular} />
            <Route path="/graficos" component={Graficos} />
            <Route path="/dedicatoria" component={Graficos2} />
            
        </Switch>
        </div>  
        <Footer/>
      </HashRouter>
      
    </div>
  );
  }
}

export default App;
