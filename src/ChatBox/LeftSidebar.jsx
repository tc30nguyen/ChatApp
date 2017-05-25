import React, { Component } from 'react'

const styles = {
	username: {
		fontSize: '2.5em',
  	color: 'darkslategray',
  	borderStyle: 'solid none',
  	borderWidth: '.01em',
  	height: '10%',
	},

	peer: {
		fontSize: '2.5em',
  	color: 'black',
  	borderStyle: 'solid none',
  	borderWidth: '.01em',
  	height: '10%',
	}
}

export default function LeftSidebar(props) {
	const peers = Array.from(props.peers).map((peer, idx) => {
		return <Peer key={idx} style={styles.peer} username={peer[0]} />
	})
	console.log(props)
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