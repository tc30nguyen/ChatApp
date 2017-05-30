import React, { Component } from 'react'

const styles = {
	inputBox: {
		float: 'left',
		height: '23%',
		margin: '1em',
		width: '85%',
    borderTop: 'slategrey',
    clear: 'both',
	},
	button: {
		height: '30%',
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
    this.props.handleSend(this.state.value)
    this.setState({value: ''})
  }

  handleKeyDown(e) {
    if(e.keyCode === 13) {
      this.onClick(e)
    }
  }

  render() {
    return (
      <div className="Input-box">
        <input
          autoFocus
        	style={styles.inputBox}
          type="text"
          value={this.state.value}
          onChange={(event) => {this.setState({value: event.target.value})}}
          onKeyDown={(e) => this.handleKeyDown(e)}
        />
        <button style={styles.button} type="button" onClick={(event) => {this.onClick(event)}}>Send</button>
      </div>
    )
  }
}