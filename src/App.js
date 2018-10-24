import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store";
import AppNavbar from "./components/layout/AppNavbar";
import Dashboard from "./components/dashboard/Dashboard";
import BudgetOperations from "./components/budgetOperations/BudgetOperations";
import Categories from "./components/categories/Categories";
import AddCategory from "./components/categories/AddCategory";
import EditCategory from "./components/categories/EditCategory";
import AddBudgetOperation from "./components/budgetOperations/AddBudgetOperation";

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
                                path="/operations"
                                component={BudgetOperations}
                            />
                            <Route
                                exact
                                path="/operations/add"
                                component={AddBudgetOperation}
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
                            <Route
                                exact
                                path="/categories/edit/:id"
                                component={EditCategory}
                            />
                        </Switch>
                    </div>
                </Router>
            </Provider>
        );
    }
}

export default App;
