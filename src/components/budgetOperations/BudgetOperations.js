import React, { Component } from "react";
import { compose } from "redux";
import { firestoreConnect } from "react-redux-firebase";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";

export class BudgetOperations extends Component {
    render() {
        const { operations } = this.props;
        console.log(operations);
        if (operations) {
            return (
                <div className="card m-2">
                    <div className="card-header container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1>Wydatki / wpływy</h1>
                            </div>
                            <div className="col-auto">
                                <Link
                                    className="btn btn-primary ml-auto"
                                    to="/operations/add"
                                >
                                    <i className="fas fa-plus" /> Dodaj
                                    wydatek/wpływ
                                </Link>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
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
                                        <td>{operation.value}</td>
                                        <td>{operation.name}</td>
                                        <td>
                                            {operation.category &&
                                                operation.category.toString()}
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
            );
        } else {
            return <Spinner />;
        }
    }
}

BudgetOperations.propTypes = {
    operations: PropTypes.array,
    firestore: PropTypes.object.isRequired
};

export default compose(
    firestoreConnect([{ collection: "budgetOperations" }]),
    connect((state, props) => ({
        operations: state.firestore.ordered.budgetOperations
    }))
)(BudgetOperations);
