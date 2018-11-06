import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import moment from "moment";
import classnames from "classnames";
import Summary from "./Summary";
import Currency from "../layout/Currency";

export class BudgetOperations extends Component {
    state = {
        operationType: "all"
    };

    componentDidUpdate() {
        const { type, month } = this.props.match.params;
        if (this.state.operationType !== type) {
            if (type === "expenses" || type === "incomes") {
                this.setState({
                    operationType: type
                });
            } else {
                this.setState({
                    operationType: "all"
                });
                this.props.history.push(`/operations/all/${month}`);
            }
        }
    }

    filterOperations = budgetOperations => {
        // filter budget operations depends on operationType parameter (can be 'all', 'expenses' or 'incomes')
        switch (this.state.operationType) {
            case "expenses":
                return budgetOperations.filter(
                    operation => operation.value < 0
                );
            case "incomes":
                return budgetOperations.filter(
                    operation => operation.value >= 0
                );
            default:
                return budgetOperations;
        }
    };

    handleMonthChange = e => {
        const { operationType } = this.state;
        this.props.history.push(
            `/operations/${operationType}/${e.target.value}`
        );
    };

    handleTypeChange = e => {
        const { month } = this.props.match.params;
        this.props.history.push(`/operations/${e.target.value}/${month}`);
    };

    validateMonthParam = monthParam => {
        if (moment(monthParam, "YYYY-MM", true).isValid()) {
            // check if given monthParam is valid month date ("YYYY-MM") - if so returns it
            return monthParam;
        } else {
            return moment().format("YYYY-MM");
        }
    };

    render() {
        const {
            operations,
            categories,
            match: {
                params: { month }
            }
        } = this.props;
        const { operationType } = this.state;
        if (operations && categories) {
            const filteredOperations = this.filterOperations(operations);
            return (
                <React.Fragment>
                    <nav className="navbar bg-light">
                        <div className="container">
                            <div className="row">
                                {/* wybór miesiąca do wyświetlenia operacji */}
                                <div className="form-group my-auto col">
                                    <select
                                        name="category"
                                        className="form-control"
                                        onChange={this.handleMonthChange}
                                        value={this.validateMonthParam(month)}
                                    >
                                        <option value="" disabled>
                                            -- Wybierz miesiąc --
                                        </option>
                                        <option value="2018-11">
                                            Listopad 2018
                                        </option>
                                        <option value="2018-10">
                                            Październik 2018
                                        </option>
                                        <option value="2018-09">
                                            Wrzesień 2018
                                        </option>
                                        <option value="2018-08">
                                            Sierpień 2018
                                        </option>
                                    </select>
                                </div>

                                {/* wybór: wszystkie, wydatki, wpływy */}
                                <div className="form-group ml-1 my-auto col">
                                    <select
                                        name="type"
                                        className="form-control"
                                        value={this.state.operationType}
                                        onChange={this.handleTypeChange}
                                    >
                                        <option value="all">
                                            Wpływy i wydatki
                                        </option>
                                        <option value="expenses">
                                            Wydatki
                                        </option>
                                        <option value="incomes">Wpływy</option>
                                    </select>
                                </div>
                                <div className="col">
                                    <Link
                                        className="btn btn-primary"
                                        to="/operation/add"
                                    >
                                        <i className="fas fa-plus" /> Dodaj
                                        wydatek/wpływ
                                    </Link>
                                </div>
                                <div className="col-12">
                                    <Summary
                                        operationType={operationType}
                                        operations={filteredOperations}
                                    />
                                </div>
                            </div>
                        </div>
                    </nav>
                    <div className="m-3">
                        <table className="table table-sm table-striped table-responsive-sm table-hover">
                            <thead className="thead-inverse">
                                <tr>
                                    <th>Data</th>
                                    <th>Wartość</th>
                                    <th>Nazwa</th>
                                    <th>Kategoria</th>
                                    <th />
                                </tr>
                            </thead>
                            <tbody>
                                {//filter expenses, incomes or all operations
                                filteredOperations.map(operation => (
                                    <tr
                                        key={operation.id}
                                        className={classnames({
                                            "text-danger": operation.value < 0,
                                            "text-success": operation.value > 0
                                        })}
                                    >
                                        <td>
                                            {operation.date &&
                                                operation.date
                                                    .toDate()
                                                    .toLocaleDateString()}
                                        </td>
                                        <td>
                                            <p className="text-right m-0">
                                                <Currency
                                                    value={operation.value}
                                                />
                                            </p>
                                        </td>
                                        <td>{operation.name}</td>
                                        <td>
                                            {operation.category &&
                                                categories.find(
                                                    category =>
                                                        category.id ===
                                                        operation.category.id
                                                ).name}
                                        </td>
                                        <td>
                                            <Link
                                                to={`/operation/${
                                                    operation.id
                                                }`}
                                            >
                                                Szczegóły
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </React.Fragment>
            );
        } else {
            return <Spinner />;
        }
    }
}

BudgetOperations.propTypes = {
    operations: PropTypes.array,
    categories: PropTypes.array,
    firestore: PropTypes.object.isRequired
};

export default compose(
    firestoreConnect(props => [
        {
            collection: "budgetOperations",
            orderBy: ["date"],
            where: (({ month }) => {
                let date;
                if (!month) {
                    // if month parameter is not - find operations beteween 1st and last day of current month
                    date = moment().startOf("month");
                } else {
                    // if month is valid 'YYYY-MM' parameter - find operations beteween 1st and last day of given month
                    date = moment(month, "YYYY-MM", true);
                }

                if (date.isValid()) {
                    return [
                        ["date", ">=", date.toDate()],
                        ["date", "<=", date.endOf("month").toDate()]
                    ];
                }
                // if none of above - find all operations
                return [];
            })(props.match.params)
        },
        { collection: "categories" }
    ]),
    connect((state, props) => ({
        operations: state.firestore.ordered.budgetOperations,
        categories: state.firestore.ordered.categories
    }))
)(BudgetOperations);
