import React, { Component } from 'react'
import InputBox from './InputBox'
import LeftSidebar from './LeftSidebar'
import TextBox from './TextBox'
import './ChatBox.css'

class Message {
  constructor(text, id) {
    this.message = text
    this.id = id
  }
}

export default class ChatBox extends Component {
  constructor(props) {
    super(props)
    this.state = {
      username: props.username,
      messages: [],
      ws: null,
      peers: new Map(),
      id: props.id,
    }
    this.setState({ws: this.initWSConnection(props.url)})
  }

  initWSConnection(url) {
    const ws = new WebSocket('ws://' + url + '/ws')
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
    if(!this.state.ws.readyState === this.state.ws.CLOSED) {
      throw String('Socket closed.')
    }
    else if(message) {
      this.state.ws.send(
        JSON.stringify(new Message(message, this.state.id))
      )
    }
  }

  render() {
    return (
      <div className="Chat-box">
        <LeftSidebar username={this.state.username} peers={this.state.peers} />
        <div className="Messages-container">
          <TextBox messages={this.state.messages} />
          <InputBox handleSend={this.handleSend.bind(this)} />
        </div>
        <div className="Right-sidebar" />
      </div>
    )
  }
}