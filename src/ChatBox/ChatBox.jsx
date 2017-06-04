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
  }

  initWSConnection(url) {
    const ws = new WebSocket('ws://' + url + '/ws')
    ws.onopen = (event) => {
      ws.send(JSON.stringify(new Message(null, this.props.id, this.props.username)))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if(Object.prototype.toString.call(message) === '[object Array]' ) {
        const peers = new Map()
        message.forEach((peer) => {
          if(!this.state.peers.has[peer] 
              && peer !== this.state.username) {
            peers.set(peer, true)
          }
        })
        this.setState({peers: peers})
      } else {
        // add new peer
        if(!this.state.peers.has[message.username] 
            && message.username !== this.state.username) {
          const peers = new Map(this.state.peers)
          peers.set(message.username, true)
          this.setState({peers: peers})
        }

        // if message is not a server notification
        if(!message.id) {
          const messages = this.state.messages.slice()    
          messages.push(message)
          this.setState({messages: messages})
        }
      }
    }
    return ws
  }

  handleSend(message) {
    if(!this.state.ws.readyState === this.state.ws.CLOSED) {
      console.log("SOCKET CLOSED")
      throw String('Socket closed.')
    }
    else if(message) {
      this.state.ws.send(
        JSON.stringify(new Message(message, this.props.id))
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