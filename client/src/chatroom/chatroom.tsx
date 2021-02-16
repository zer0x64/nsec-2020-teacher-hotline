import React from 'react';
import './chatroom.css';
import {CircularProgress} from '@material-ui/core';
import { Widget, addResponseMessage } from 'react-chat-widget';

import PythonModule from '../python';

class Chatroom extends React.Component<{setAppState: Function}, {loading: boolean, disconnected: boolean, full: boolean}> {
  socket: WebSocket
  msgcounter: number;

  constructor(props) {
    super(props)
    this.state = { loading: true, disconnected: false, full: false}
  }

  async componentDidMount() {
    let websocketAddress = "ws://" + window.location.host + "/ws"
    this.socket = new WebSocket(websocketAddress);

    this.socket.onmessage = (message) => {
      if(message.data == "Paired") {
        this.setState({loading: false, disconnected: false});
      }
      else if(message.data == "Unpaired") {
        this.setState({loading: true, disconnected: true});
      }
      else if(message.data == "Full") {
        this.setState({full: true});
      }
      else {
        let msg: string = PythonModule.deserializeMessage(message);
        (document.getElementById("latestMessage") as HTMLInputElement).value = msg;
        addResponseMessage(msg)
      }
    };
  }

  componentWillUnmount() {
    if(this.socket) {
      this.socket.close()
    }
  }

  handleNewUserMessage = (newMessage: string) => {
    this.socket.send(PythonModule.serializeMessage(newMessage))
  }

  render() {
    if(this.state.full) {
      return (
        <p>The queue is full. Please come another time.</p>
      )
    }

    let disconnectedText;
    if(this.state.disconnected) {
      disconnectedText = (
        <p>The other user has been disconnected!</p>
      )
    }

    if(this.state.loading) {
      return (
        <div className="loading">
          {disconnectedText}
          <p>Waiting for a peer to talk to...</p>
          <p>If none are available, you will be assigned with a bot.</p>
          <p>Note that only one bot per team will be assigned at a given time.</p>
          <CircularProgress size="15%"></CircularProgress>
          <input type="hidden" id="parsingBuffer" value=""></input>
          <input type="hidden" id="latestMessage" value=""></input>
        </div>
      )
    }
    else {
      return (
        <div>
          <Widget id="chatButton" className="Chat"
            handleNewUserMessage={this.handleNewUserMessage} 
            title="Chat"
            subtitle=""/>
          <p>Use the button on the bottom right to use the chat.</p>
          <input type="hidden" id="parsingBuffer" value=""></input>
          <input type="hidden" id="latestMessage" value=""></input>
        </div>
      );
    }
  }
}

export default Chatroom