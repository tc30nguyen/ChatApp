import React, { Component } from 'react'

const styles = {
	username: {
		fontFamily: '"Courier New", Courier, monospace',
		fontSize: '1em',
	  	borderStyle: 'inset none',
	  	borderWidth: '.03em',
	  	height: '4%',
		  color: '#C8C8C8',
  		borderColor: '#C8C8C8',
  		paddingTop: '5%',
	},

	peer: {
		fontSize: '1em',
		paddingTop: '.5em',
  	color: 'black',
  	borderStyle: 'solid none',
  	borderWidth: '.03em',
  	height: '4%',
	}
}

export default function LeftSidebar(props) {
	const peers = Array.from(props.peers)
		.filter((peer) => peer[0] !== props.username)
		.map((peer, idx) => {
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