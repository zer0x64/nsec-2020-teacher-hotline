import React from 'react';
import { FormGroup, TextField, Button, createMuiTheme, MuiThemeProvider } from '@material-ui/core';
import { withStyles } from "@material-ui/core/styles";

import AppState from '../appstate';

const styles = {
  input: {
    color: "white"
  }
};
  

const palette = createMuiTheme({
    palette: {
        primary: { main: '#00e5ff', contrastText: 'white'},
        secondary: { main: '#2979ff', contrastText: 'white' },
    }
})

class LoginPage extends React.Component<{setAppState: Function, setLoggedIn: Function}, {username: string, password: string, badPassword: boolean}> {
    classes;

    constructor(props) {
        super(props)
        const {classes} = props;
        this.classes = classes;
        this.state = {
            username:'',
            password:'',
            badPassword: false,
        }
    }

    async handleClick(event) {
        event.preventDefault()
        let response: Response = await fetch('/login', {
            method: 'post', 
            body: JSON.stringify(
                {username: this.state.username, password: this.state.password}
            ),
            headers: {
                'Content-Type': 'application/json'
              },
        });

        if(response.ok) {
            this.props.setLoggedIn(true)
            this.props.setAppState(AppState.chatroom)
        }
        else {
            this.setState({badPassword: true})
        }
    }

    handleChange(event, target) {
        let newState = {};
        newState[target] = event.target.value;
        this.setState(newState)
    }

    render() {
        let badPassword;
        if(this.state.badPassword) {
            badPassword = (<p>Couldn't log you in with the specified credentials</p>)
        }

        return (
            <MuiThemeProvider theme={palette}>
                <form onSubmit={(e) => this.handleClick(e)}>
                    <TextField
                        InputProps={{className: this.classes.input}}
                        color = "primary"
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Email Address"
                        name="username"
                        autoFocus
                        value={this.state.username}
                        onChange={(e) => this.handleChange(e, "username")}
                    />
                    <TextField
                        InputProps={{className: this.classes.input}}
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={this.state.password}
                        onChange={(e) => this.handleChange(e, "password")}
                    />
                    <Button id="submitLogin" color="primary" type="submit">Login</Button>
                </form>
                {badPassword}
            </MuiThemeProvider>
        )
    }
}

export default withStyles(styles)(LoginPage);
