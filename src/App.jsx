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

  handleSubmit(username) {
    this.setState({username: username})
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Greeting username={this.state.username} handleSubmit={this.handleSubmit.bind(this)} />
      </div>
    )
  }
}

function Greeting(props) {
  const username = props.username
  if(username) {
    return <ChatBox username={username} />
  }
  return <NameForm onSubmit={props.handleSubmit} />
}