import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  state = {
    data: null
  }

  componentDidMount() {
    this.callBackendAPI()
      .then(res => this.setState({data: res.message}))
      .catch(err => console.log(err));
  }

  callBackendAPI = async () => {
    const response = await fetch('/api_call');
    const body = await response.json();

    if (response.status !== 200) {
      throw Error(body.message);
    }

    return body;
  }

  render() {
    return (
      <p>{this.state.data}</p>
    );
  }
}

export default App;
