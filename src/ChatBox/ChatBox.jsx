import React, { Component } from 'react'
import InputBox from './InputBox'
import LeftSidebar from './LeftSidebar'
import TextBox from './TextBox'
import './ChatBox.css'

export class Message {
  constructor(text, id, username) {
    this.message = text
    this.id = id
    this.username = username
  }
}

export default class ChatBox extends Component {
  constructor(props) {
    super(props)
    console.log(props.id)
    const ws = this.initWSConnection(props.url)
    this.state = {
      messages: [],
      ws: ws,
      peers: new Map(),
    }
    // ws.send(new Message(null, null, props.username))
  }

  initWSConnection(url) {
    const ws = new WebSocket('ws://' + url + '/ws')
    ws.onopen = (event) => {
      ws.send(JSON.stringify(new Message(null, this.props.id, this.props.username)))
    }
    ws.onmessage = (event) => {
      const messages = this.state.messages.slice()    
      const message = JSON.parse(event.data)
      if(!this.state.peers.has[message.username] 
          && message.username !== this.state.username) {
        const peers = new Map(this.state.peers)
        peers.set(message.username, true)
        this.setState({peers: peers})
      }
      messages.push(message)
      this.setState({messages: messages})
    }
    return ws
  }

  handleSend(message) {
    console.log('sending message stuff')
    if(!this.state.ws.readyState === this.state.ws.CLOSED) {
      console.log("SOCKET CLOSED")
      throw String('Socket closed.')
    }
    else if(message) {
      console.log("sending msg: " + message)
      this.state.ws.send(
        JSON.stringify(new Message(message, this.props.id, this.props.username))
      )
    }
  }

  render() {
    return (
      <div className="Chat-box">
        <LeftSidebar username={this.props.username} peers={this.state.peers} />
        <div className="Messages-container">
          <TextBox messages={this.state.messages} />
          <InputBox handleSend={this.handleSend.bind(this)} />
        </div>
        <div className="Right-sidebar" />
      </div>
    )
  }
}