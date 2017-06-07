import React, { Component } from 'react'

const styles = {
	username: {
		fontFamily: '"Courier New", Courier, monospace',
		fontSize: '1em',
	  	borderStyle: 'inset none',
	  	borderWidth: '.03em',
	  	height: '4%',
		  color: 'black',
  		borderColor: 'black',
  		paddingTop: '5%',
	},

	peer: {
		fontFamily: '"Courier New", Courier, monospace',
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
	console.log(this)
	return <div 
		style={styles.peer} 
		onMouseOver={(e) => e.target.style.backgroundColor = '#4d4d4d'}
		onMouseOut={(e) => e.target.style.backgroundColor = 'grey'}>
			{props.username}
	</div>
} 

export class ABC extends Component {} //temporarily for compiler warnings