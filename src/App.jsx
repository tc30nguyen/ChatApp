import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import ChatBox from './ChatBox'

export default class App extends Component {
  constructor() {
    super()
    this.state = {username: null}
  }

  onSubmit(event) {
    this.setState({username: event.target.username.value})
    event.preventDefault()
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Test Chat App</h2>
        </div>
        <Greeting username={this.state.username} onSubmit={this.onSubmit.bind(this)} />
      </div>
    )
  }
}

function Greeting(props) {
  const username = props.username
  if(username) {
    return <ChatBox username={username} />
  }
  return <NameForm onSubmit={props.onSubmit} />
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
        Username: <input 
          name="username" 
          type="text" 
          value={this.state.value} 
          onChange={this.handleChange} 
        />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}