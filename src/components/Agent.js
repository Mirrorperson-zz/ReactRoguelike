import { Component } from 'react';
import AgentsData from '../AgentsContent.json';

class Agent extends Component {
  state = {};

  constructor(props) {
    super(props);

    this.state = {
      id: props.id,
      type: props.type,
      str: AgentsData[props.type].str,
      agi: AgentsData[props.type].agi,
      dex: AgentsData[props.type].dex,
      wis: AgentsData[props.type].wis,
      int: AgentsData[props.type].int,
      position: AgentsData[props.type].startPosition
    };
  }
}

export default Agent;
