import React, { Component } from 'react'

export default function TextBox(props) {
  const textLines = props.messages.map((message, idx) => {
    const msg = JSON.parse(message)
    return <TextLine key={idx} username={msg.username} text={msg.message} />
  })

  return (
    <div className="Text-box">
      {textLines}
    </div>
  )
}

function TextLine(props) {
  return <div className="Text-line">{props.username}: {props.text}</div>
}