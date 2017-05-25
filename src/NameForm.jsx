import React, { Component } from 'react'

const styles = {
  textField: {
    margin: '1em .3em',
    height: '1.5em',
  },
  button: {
    height: '1.9em'
  }
}

export default class NameForm extends Component {
  constructor(props) {
    super(props)
    this.state = {value: ''}
    this.handleChange = this.handleChange.bind(this)
  }

  handleChange(e) {
    this.setState({value: e.target.value})
  }

  handleKeyDown(e) {
    if(e.keyCode === 13) {
      this.props.onSubmit(this.state.value)
    }
  }

  render() {
    return (
      <div className="Name-form">
        <input
          autoFocus
          style={styles.textField}
          type="text"
          value={this.state.value}
          onKeyDown={(e) => this.handleKeyDown(e)}
          onChange={this.handleChange}
          placeholder="Enter username"
        />
        <button
          style={styles.button}
          type="button"
          onClick={() => this.props.onSubmit(this.state.value)}
        >Submit</button>
      </div>
    )
  }
}