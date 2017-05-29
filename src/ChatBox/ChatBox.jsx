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
    const username = props.username
    // const url = 'localhost:8000'
    const url = '10.0.0.9:8000'
    const ws = new WebSocket('ws://' + url + '/ws')
    this.state = {
      username: username,
      messages: [],
      ws: ws,
      connected: false,
      peers: new Map(),
      id: props.id,
    }
    this.initWSConnection(ws)
  }

  initWSConnection(ws) {
    ws.onopen = (event) => {
      this.setState({connected: true})
      this.handleSend(this.state.username, this.state.id)
    }

    ws.onclose = (event) => {
      console.log('WS connection closed')
      this.setState({connected: false})
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
  }

  handleSend(message) {
    if(!this.state.connected) {
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
          <InputBox
            handleSend={this.handleSend.bind(this)}
            connected={this.state.connected}
          />
        </div>
        <div className="Right-sidebar" />
      </div>
    )
  }
}