import React, { Component } from 'react'
import InputBox from './InputBox'
import TextBox from './TextBox'

class Message {
  constructor(username, text) {
    this.username = username
    this.message = text
  }
}

export default class ChatBox extends Component {
  constructor(props) {
    super(props)
    const username = props.username
    const ws = new WebSocket('ws://localhost:8000/ws')
    this.state = {
      username: username,
      messages: [],
      ws: ws,
      connected: false,
    }
    this.initWSConnection(ws)
  }

  initWSConnection(ws) {
    ws.onopen = (event) => {
      this.setState({connected: true})
      this.handleSend(this.state.username + ' has connected.')
    }
    ws.onclose = (event) => {
      console.log('WS connection closed')
      this.setState({connected: false})
    }
    ws.onmessage = (event) => {
      const messages = this.state.messages.slice()
      messages.push(event.data)
      this.setState({messages: messages})
    }
  }

  handleSend(message) {
    if(!this.state.connected) {
      throw String('Socket closed.')
    }
    else if(message) {
      this.state.ws.send(
        JSON.stringify(new Message(this.state.username, message))
      )
    }
  }

  render() {
    return (
      <div>
        <div className="Username">{this.state.username}</div>
        <TextBox messages={this.state.messages} />
        <InputBox
          handleSend={this.handleSend.bind(this)}
          connected={this.state.connected}
        />
      </div>
    )
  }
}