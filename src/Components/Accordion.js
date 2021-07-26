import React, { Component } from 'react';
import { Accordion, Icon } from 'semantic-ui-react';

const styles={
    box:{
        position:"relative",
        display:"block",
        marginLeft: "auto",
        marginRight: "auto",
       
    }
}
export default class Accordeon extends Component {
    constructor(props){
        super(props);
    
        this.state = { activeIndex: -1 }
    }
  handleClick = (e, titleProps) => {
    let  index  = titleProps.index     
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }

  render() {
    const { activeIndex } = this.state
    
    return (

    <div style={styles.box} align="center">
        <Accordion>
            <Accordion.Title
              active={activeIndex === this.props.indice}
              index={this.props.indice}
              onClick={this.handleClick}
              style={{fontSize:'24px'}}
            >
            <Icon name='dropdown' />
            {this.props.title}
            </Accordion.Title>
            <Accordion.Content active={activeIndex === this.props.indice} style={{fontSize:'19px',marginTop:'-20px'}} >
            <p>
              {this.props.content}
            </p>
            </Accordion.Content>
        </Accordion>
    </div>
    );
  }
}