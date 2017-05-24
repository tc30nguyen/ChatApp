import React, { Component } from 'react'
import Message from './Message'

export default class ChatBox extends Component {
  constructor(props) {
    super(props)
    const ws = new WebSocket('ws://localhost:8000/ws')
    const username = props.username
    this.state = {
      username: username,
      messages: [],
      ws: ws,
      connected: false,
    }

    ws.onopen = (event) => {
      this.setState({connected: true})
      this.handleSend(username + ' has connected.')
      // ws.send(new Message(username, username + ' has connected.'))
    }
    ws.onclose = (event) => {
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
      throw 'Socket closed.'
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

function TextBox(props) {
  const textLines = props.messages.map((message, idx) => {
    const msg = JSON.parse(message)
    return <TextLine key={idx} username={msg.username} text={msg.message} />
  })

  return (
    <div className="Text-box">
      {textLines}
    </div>
  )
}

function TextLine(props) {
  return <div className="Text-line">{props.username}: {props.text}</div>
}

class InputBox extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
  }

  onClick(event) {
    if(this.props.connected) {
      this.props.handleSend(this.state.value)
      this.setState({value: ''})
    }
  }

  render() {
    return (
      <div className="Input-box">
        <input
          type="text"
          value={this.state.value}
          onChange={(event) => {this.setState({value: event.target.value})}}
        />
        <button type="button" onClick={(event) => this.onClick(event)}>Send</button>
      </div>
    )
  }
}