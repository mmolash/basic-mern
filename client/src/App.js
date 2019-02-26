import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from "axios";

class App extends Component {
  state = {
    data: [],
    message: null,
    update: null,
    update_id: null,
    delete_id: null
  }

  componentDidMount() {
    this.getDataFromDB()
  }

  getDataFromDB = () => {
    fetch('/get_data')
      .then((data) => data.json())
      .then((res) => this.setState({data: res.data}))
  }

  writeDataToDB = (message) => {
    axios.post('/write_data', {message: message})
      .then(() => this.getDataFromDB())
  }

  deleteDataFromDB = (id) => {
    axios.delete('/delete_data', {data: {id: id}})
      .then(() => this.getDataFromDB())
  }

  updateDataToDB = (id, message) => {
    axios.post('/update_data', {id: id, update: {message: message}})
      .then(() => this.getDataFromDB())
  }

  render() {
    return(
      <div>
        <div>
          <ul>
            {this.state.data.length <= 0
              ? "No entries in database yet."
              : this.state.data.map(dat => (
                <li style={{padding: "10px"}} key={dat._id}>
                  <span style={{color: "gray"}}> id: </span> {dat._id} <br/>
                  <span style={{color: "gray"}}> data: </span> {dat.message}
                </li>
              ))}
          </ul>
        </div>
        <div style={{padding: "10px"}}>
          <input type="text" onChange={(e) => this.setState({ message: e.target.value })}
            placeholder="add something in the database" style={{width: "200px"}}/>
          <button onClick={() => this.writeDataToDB(this.state.message)}>add</button>
        </div>
        <div style={{padding: "10px"}}>
          <input type="text" onChange={(e) => this.setState({ delete_id: e.target.value })}
            placeholder="delete id in the database" style={{width: "200px"}}/>
          <button onClick={() => this.deleteDataFromDB(this.state.delete_id)}>delete</button>
        </div>
        <div style={{padding: "10px"}}>
          <input type="text" onChange={(e) => this.setState({ update_id: e.target.value })}
            placeholder="update id in the database" style={{width: "200px"}}/>
          <input type="text" onChange={(e) => this.setState({ update: e.target.value })}
              placeholder="update message in the database" style={{width: "200px"}}/>
          <button onClick={() => this.updateDataToDB(this.state.update_id, this.state.update)}>update</button>
        </div>
        <div style={{padding: "10px"}}>
          <button onClick={() => this.getDataFromDB()}>load</button>
        </div>
      </div>
    )
  }
}

export default App;
