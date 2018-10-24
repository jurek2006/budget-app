import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

export class BudgetOperationDetails extends Component {
    constructor(props) {
        super(props);

        this.valueInput = React.createRef();
        this.nameInput = React.createRef();
    }
    state = {
        isEditingOn: false
    };

    onSubmit = e => {
        e.preventDefault();

        const { operation, firestore, history } = this.props;
        const updOperation = {
            name: this.nameInput.current.value.trim(),
            value:
                this.valueInput.current.value.trim().length > 0
                    ? this.valueInput.current.value.trim()
                    : 0
        };

        // update in firestore only if value > 0 and non empty name given
        if (updOperation.name.length > 0 && updOperation.value > 0) {
            firestore
                .update(
                    { collection: "budgetOperations", doc: operation.id },
                    updOperation
                )
                .then(() => history.push("/operations"));
        }
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    handleTurnEditingOn = () => {
        // handles click on "Edit" button - turns editing on
        this.setState({
            isEditingOn: true
        });
    };

    handleDeleteContact = operationId => {
        const { firestore, history } = this.props;
        firestore
            .delete({ collection: "budgetOperations", doc: operationId })
            .then(() => history.push("/operations"));
    };

    render() {
        if (this.props.operation) {
            const { date, value, name, id } = this.props.operation;
            const { isEditingOn } = this.state;
            return (
                <div className="card m-2">
                    <div className="card-header container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h2>Wydatek/wpływ</h2>
                            </div>
                            <div className="col-auto">
                                <div className="btn-group float-right">
                                    <button
                                        className="btn btn-dark"
                                        onClick={this.handleTurnEditingOn}
                                    >
                                        <i className="fas fa-edit" /> Edytuj
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={this.handleDeleteContact.bind(
                                            this,
                                            id
                                        )}
                                    >
                                        <i className="fas fa-trash" /> Usuń
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <form onSubmit={this.onSubmit}>
                            <div className="form-group">
                                <label htmlFor="date">Data:</label>
                                <input
                                    type="text"
                                    name="date"
                                    disabled
                                    className="form-control"
                                    defaultValue={
                                        date &&
                                        date.toDate().toLocaleDateString()
                                    }
                                    onChange={this.onChange}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="value">Wartość:</label>
                                <input
                                    type="number"
                                    name="value"
                                    className="form-control"
                                    defaultValue={value}
                                    onChange={this.onChange}
                                    disabled={!isEditingOn}
                                    ref={this.valueInput}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="name">Nazwa:</label>
                                <input
                                    type="text"
                                    name="name"
                                    className="form-control"
                                    defaultValue={name}
                                    onChange={this.onChange}
                                    disabled={!isEditingOn}
                                    ref={this.nameInput}
                                />
                            </div>
                            {isEditingOn && (
                                <input
                                    type="submit"
                                    value="Zapisz"
                                    className="btn btn-primary btn-block mt-2"
                                />
                            )}
                        </form>
                    </div>
                </div>
            );
        } else {
            return <Spinner />;
        }
    }
}

BudgetOperationDetails.propTypes = {
    firestore: PropTypes.object.isRequired
};

export default compose(
    firestoreConnect(props => [
        {
            collection: "budgetOperations",
            storeAs: "operation",
            doc: props.match.params.id
        }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        operation:
            ordered.operation &&
            ordered.operation.find(
                operation => operation.id === props.match.params.id
            )
    }))
)(BudgetOperationDetails);
