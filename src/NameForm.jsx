import React, { Component } from 'react'

export default class NameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(event) {
    this.setState({value: event.target.value})
  }

  render() {
    return (
      <div className="Name-form">
        <input type="text" value={this.state.value} onChange={this.handleChange} placeholder="Enter username" />
        <button type="button" onClick={() => this.props.onSubmit(this.state.value)}>Submit</button>
      </div>
    )
  }
}