import React, { Component } from 'react'

const styles = {
	username: {
		fontFamily: '"Courier New", Courier, monospace',
		fontSize: '1.0em',
	  	borderStyle: 'inset none',
	  	borderWidth: '.03em',
	  	height: '4%',
		  color: '#C8C8C8',
  		borderColor: '#C8C8C8',
  		paddingTop: '5%',
	},

	peer: {
		fontSize: '2.5em',
	  	color: 'black',
	  	borderStyle: 'solid none',
	  	borderWidth: '.03em',
	  	height: '4%',
	}
}

export default function LeftSidebar(props) {
	const peers = Array.from(props.peers).map((peer, idx) => {
		return <Peer key={idx} style={styles.peer} username={peer[0]} />
	})
	return (
		<div className="Left-sidebar">
      <div style={styles.username} className="Username">{props.username}</div>
      {peers}
    </div>
	)
}

function Peer(props) {
	return <div style={styles.peer}>{props.username}</div>
} 

export class ABC extends Component {} //temporarily for compiler warnings