import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import AppNavbar from "./components/layout/AppNavbar";
import Dashboard from "./components/dashboard/Dashboard";
import Expenses from "./components/expenses/Expenses";
import Categories from "./components/categories/Categories";
import AddCategory from "./components/categories/AddCategory";

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
            <Provider store={store}>
                <Router>
                    <div className="App">
                        <AppNavbar />
                        <Switch>
                            <Route exact path="/" component={Dashboard} />
                            <Route
                                exact
                                path="/expenses"
                                component={Expenses}
                            />
                            <Route
                                exact
                                path="/categories"
                                component={Categories}
                            />
                            <Route
                                exact
                                path="/categories/add"
                                component={AddCategory}
                            />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
