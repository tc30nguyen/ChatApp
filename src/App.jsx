import React, { Component } from 'react'
import ChatBox from './ChatBox/ChatBox'
import NameForm from './NameForm'
import logo from './logo.svg'
import './App.css'

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