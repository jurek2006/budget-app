import React, { Component } from "react";
import "./App.css";
import { Collapse, Button, Card, CardBody } from "reactstrap";

class App extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.state = { collapse: false };
    }

    toggle() {
        this.setState({ collapse: !this.state.collapse });
    }

    render() {
        return (
            <div className="App">
                <h1>Hello</h1>
            </div>
        );
    }
}

export default App;
