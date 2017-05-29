import React, { Component } from 'react'

export default function TextBox(props) {
  const textLines = props.messages.map((msg, idx) => {
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

export class ABC extends Component {} //temporarily for compiler warnings