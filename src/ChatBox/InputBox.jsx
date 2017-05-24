import React, { Component } from 'react'

export default class InputBox extends Component {
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