import React, { Component } from 'react'
import ChatBox, { Message } from './ChatBox/ChatBox'
import NameForm from './NameForm'
import logo from './logo.svg'
import './App.css'

const url = '10.192.2.228:8000'
// const url = 'localhost:8000'

const styles = {
  usernameSubmitError: {
    color: 'red'
  }
}

export default class App extends Component {
  constructor() {
    super()
    this.state = {
      username: null,
      userId: null,
      error: null,
    }
  }

  handleSubmit(username) {
    fetch('http://' + url + '/username', {
      method: 'POST',
      body: JSON.stringify(new Message(username))
    }).then((res) => {
      if(!res.ok) {
        const errorMsg = 'Username is not valid or already in use.'
        this.setState({error: errorMsg})
        throw new Error(errorMsg)
      }
      res.text().then((body) => {
        this.setState({username: username, userId: body})
      })
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
          id={this.state.userId}
          error={this.state.error}
        />
      </div>
    )
  }
}

function Greeting(props) {
  if(props.username) {
    return <ChatBox username={props.username} url={props.url} id={props.id} />
  } else {
    const nameForm = <NameForm onSubmit={props.handleSubmit} />
    if(props.error) {
      return (
        <div>
          <div style={styles.usernameSubmitError}>{props.error}</div>
          {nameForm}
        </div>
      )
    } else {
      return nameForm
    }
  }
}