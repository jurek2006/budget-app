import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";
import moment from "moment";

export class BudgetOperations extends Component {
    handleMonthChange = e => {
        this.props.history.push(`/operations/month/${e.target.value}`);
    };

    render() {
        const { operations, categories } = this.props;
        if (operations && categories) {
            return (
                <React.Fragment>
                    <div className="card m-2">
                        <div className="card-header container-fluid">
                            <div className="row align-items-center">
                                <div className="col">
                                    <h1>Wydatki / wpływy</h1>
                                </div>
                                <div className="col-auto">
                                    <Link
                                        className="btn btn-primary ml-auto"
                                        to="/operation/add"
                                    >
                                        <i className="fas fa-plus" /> Dodaj
                                        wydatek/wpływ
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <div className="card-body">
                            <nav className="navbar bg-light">
                                <div className="form-group">
                                    <select
                                        name="category"
                                        className="form-control"
                                        onChange={this.handleMonthChange}
                                    >
                                        <option value="">
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
                            </nav>
                            <table className="table table-striped">
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
                                    {operations.map(operation => (
                                        <tr key={operation.id}>
                                            <td>
                                                {operation.date &&
                                                    operation.date
                                                        .toDate()
                                                        .toLocaleDateString()}
                                            </td>
                                            <td>
                                                <p className="text-right">
                                                    {new Intl.NumberFormat(
                                                        "pl-PLN",
                                                        {
                                                            style: "currency",
                                                            currency: "PLN"
                                                        }
                                                    ).format(operation.value)}
                                                </p>
                                            </td>
                                            <td>{operation.name}</td>
                                            <td>
                                                {operation.category &&
                                                    categories.find(
                                                        category =>
                                                            category.id ===
                                                            operation.category
                                                                .id
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
                if (month === "current") {
                    // if month parameter is "current"- find operations beteween 1st and last day of current month
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
