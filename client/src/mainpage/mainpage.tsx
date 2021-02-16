import React from 'react';
import Button from '@material-ui/core/Button'
import AppState from '../appstate';

class MainPage extends React.Component<{setAppState: Function}, {}> {
    constructor(props) {
        super(props)
    }

    componentDidMount() {
    }

    render() {
        return (
            <div>
                <p>TeachHelp is teacher hotline platform.</p>
                <p>Log in as either a teacher or a student.</p>
                <Button id="redirectToLogin" variant="contained" color="primary" onClick={() => {this.props.setAppState(AppState.loginpage)}}>Login as teacher</Button>
                <Button id="redirectToChatroom" variant="contained" color="secondary" onClick={() => {this.props.setAppState(AppState.chatroom)}}>Go to the chatroom</Button>
            </div>
        )
    }
}

export default MainPage;
