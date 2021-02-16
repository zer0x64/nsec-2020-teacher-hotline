import React from 'react';
import './App.css';
import 'react-chat-widget/lib/styles.css';

import Logo from './logo.png';

import { w3cwebsocket as W3CWebSocket } from "websocket";

import {AppBar, IconButton, Toolbar, CircularProgress, Button, Typography, Icon} from '@material-ui/core';
import { ArrowBack } from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';

import PythonModule from './python';
import AppState from './appstate';
import Chatroom from './chatroom/chatroom';
import MainPage from './mainpage/mainpage';
import Login from './login/login';

const styles = {
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    alignSelf: "center",
  },
  logo: {
    maxWidth: 160,
    alignSelf: "center",
  }
};

class App extends React.Component<{}, {state: AppState, isLoggedIn: boolean, flag: string}> {
  socket: W3CWebSocket
  classes;

  constructor(props) {
    super(props)
    const {classes} = props;
    this.classes = classes;
    this.state = { state: AppState.loading, isLoggedIn: false, flag: null }
  }

  async componentDidMount() {
    await PythonModule.initializeWasm()

    let flag = await this.getFlag()

    let isLoggedIn = await fetch("/isLoggedIn");
    if (isLoggedIn.ok) {
      this.setState({state: AppState.chatroom, isLoggedIn: true, flag: flag});
    }
    else {
      this.setState({state: AppState.mainpage, isLoggedIn: false, flag: flag});
    }
  }

  async logout() {
    let isLoggedOut = await fetch("/logout");
    if(isLoggedOut.ok) {
      this.setState({state: AppState.mainpage, isLoggedIn: false});
    }
  }

  async getFlag(): Promise<string> {
    let flagRequest = await fetch("/flag");

    if (flagRequest.ok) {
      return await flagRequest.text();
    }
    else {
      return null;
    }
  }

  async setLoggedIn(isLoggedIn: boolean) {
    let flag = await this.getFlag()
    this.setState({isLoggedIn: isLoggedIn, flag: flag})
  }
  
  setAppState(state: AppState) {
    this.setState({'state': state})
  }

  render() {
    let content;
    let backButton;
    let logoutButton;
    let flagBox;

    if(this.state.flag){
      flagBox = (
        <Typography variant="subtitle1" color="secondary" style={{ fontWeight: "bold" }}>{this.state.flag}</Typography>
    )};

    if(this.state.isLoggedIn) {
      logoutButton = (
        <Button color="inherit" onClick={() => this.logout()}>Logout</Button>
      )
    }

    if(this.state.state == AppState.loading) {
      backButton = (
        <IconButton disabled><ArrowBack/></IconButton>
      )
      content = ( 
        <div className="Loading App-Header">
          <CircularProgress size="15%" id="loading"/>
        </div>);
    }
    else if(this.state.state == AppState.mainpage) {
      backButton = (
        <IconButton disabled><ArrowBack/></IconButton>
      )
      content = (
        <MainPage setAppState={this.setAppState.bind(this)}/>
      )
    }
    else if(this.state.state == AppState.loginpage) {
      backButton = (
        <IconButton onClick={() => this.setAppState(AppState.mainpage)}><ArrowBack/></IconButton>
      )
      content = (
        <Login setAppState={this.setAppState.bind(this)} setLoggedIn={this.setLoggedIn.bind(this)}/>
      )
    }
    else if(this.state.state == AppState.chatroom) {
      backButton = (
        <IconButton edge="start" onClick={() => this.setAppState(AppState.mainpage)}><ArrowBack/></IconButton>
      )
      content = (
        <Chatroom setAppState={this.setAppState.bind(this)}/>
      );
    }

    return (
      <div className="App">
        <AppBar className={this.classes.root}>
          <Toolbar>
          {backButton}
          <div className={this.classes.title}>
            <img id="logo" src={Logo} className={this.classes.logo}></img>
          </div>
          {flagBox}
          {logoutButton}
          </Toolbar>
        </AppBar>
        {content}
      </div>
    );
  }
}


export default withStyles(styles)(App);
