import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";

export class AddBudgetOperation extends Component {
    state = {
        date: "",
        value: "",
        name: ""
    };

    onSubmit = e => {
        e.preventDefault();

        const newOperation = {
            ...this.state,
            date: new Date(2018, 9, 24)
        };
        console.log(newOperation);
        const { firestore, history } = this.props;

        if (
            Number(newOperation.value) > 0 &&
            newOperation.name.trim().length > 0
        ) {
            firestore
                .add({ collection: "budgetOperations" }, newOperation)
                .then(() => history.push("/operations"));
        }
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        const { date, value, name } = this.state;
        return (
            <div className="card m-2">
                <div className="card-header">
                    <h2>Dodaj wydatek/wpływ</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="form-group">
                            <label htmlFor="date">Data:</label>
                            <input
                                type="text"
                                name="date"
                                readOnly
                                className="form-control"
                                value={date}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="value">Wartość:</label>
                            <input
                                type="number"
                                name="value"
                                className="form-control"
                                value={value}
                                onChange={this.onChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nazwa:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={this.onChange}
                            />
                        </div>
                        <input
                            type="submit"
                            value="Zapisz"
                            className="btn btn-primary btn-block mt-2"
                        />
                    </form>
                </div>
            </div>
        );
    }
}

AddBudgetOperation.propTypes = {
    firestore: PropTypes.object.isRequired
};

export default firestoreConnect()(AddBudgetOperation);
