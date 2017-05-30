import React, { Component } from 'react'
import ChatBox, { Message } from './ChatBox/ChatBox'
import NameForm from './NameForm'
import logo from './logo.svg'
import './App.css'

const url = '10.0.0.9:8000'
const id = 'testabc123' //temp

export default class App extends Component {
  constructor() {
    super()
    this.state = {username: null}
  }

  handleSubmit(username) {
    fetch('http://' + url + '/username', {
      method: 'POST',
      body: new Message(username, id)
    }).then((res) => {
      if(!res.ok) {
        throw new Error('Username is not valid or already in use.')
      }
      this.setState({username: username})
    }).catch((e) => {
      console.log(e)
    })
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
        </div>
        <Greeting 
          username={this.state.username} 
          handleSubmit={this.handleSubmit.bind(this)} 
          url={url}
        />
      </div>
    )
  }
}

function Greeting(props) {
  const username = props.username
  if(username) {
    return <ChatBox username={username} url={props.url} />
  }
  return <NameForm onSubmit={props.handleSubmit} />
}