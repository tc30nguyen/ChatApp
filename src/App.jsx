import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  onSubmit(event) {
    console.log(event.target)
    event.preventDefault()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to React</h2>
        </div>
        <NameForm onSubmit={this.onSubmit} />
      </div>
    )
  }
}

class NameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  render() {
    return (
      <form onSubmit={this.props.onSubmit}>
        Username: <input type="text" value={this.state.value} onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}

export default App;