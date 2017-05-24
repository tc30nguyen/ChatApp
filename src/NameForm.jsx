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
      <form onSubmit={this.props.onSubmit}>
        Username: <input 
          name="username" 
          type="text" 
          value={this.state.value} 
          onChange={this.handleChange} 
        />
        <input type="submit" value="Submit" />
      </form>
    )
  }
}