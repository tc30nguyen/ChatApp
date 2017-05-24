import React, { Component } from 'react'

const styles = {
	inputBox: {
		float: 'left',
		height: '30%',
		margin: '1em',
		width: '80%',
	},
	button: {
		height: '40%',
		width: '10%',
		float: 'left',
		margin: '1em 0em',
	}
}

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
        	style={styles.inputBox}
          type="text"
          value={this.state.value}
          onChange={(event) => {this.setState({value: event.target.value})}}
        />
        <button style={styles.button} type="button" onClick={(event) => {this.onClick(event)}}>Send</button>
      </div>
    )
  }
}