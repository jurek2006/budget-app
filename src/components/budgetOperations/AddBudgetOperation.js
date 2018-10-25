import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";

export class AddBudgetOperation extends Component {
    state = {
        date: null,
        value: "",
        name: ""
    };

    handleSubmit = e => {
        e.preventDefault();

        const newOperation = {
            ...this.state,
            date: this.state.date && this.state.date.toDate()
        };
        const { firestore, history } = this.props;

        if (
            Number(newOperation.value) > 0 &&
            newOperation.name.trim().length > 0 &&
            newOperation.date
        ) {
            firestore
                .add({ collection: "budgetOperations" }, newOperation)
                .then(() => history.push("/operations"));
        }
    };

    handleFieldChange = e => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    };

    handleDateChange = date => {
        this.setState({ date });
    };

    render() {
        const { date, value, name } = this.state;
        return (
            <div className="card m-2">
                <div className="card-header">
                    <h2>Dodaj wydatek/wpływ</h2>
                </div>
                <div className="card-body">
                    <form onSubmit={this.handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="date">Data:</label>
                            <DatePicker
                                selected={date}
                                onChange={this.handleDateChange}
                                placeholderText="Wybierz datę"
                                dateFormat="DD.MM.YYYY"
                                className="form-control"
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="value">Wartość:</label>
                            <input
                                type="number"
                                name="value"
                                className="form-control"
                                value={value}
                                onChange={this.handleFieldChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="name">Nazwa:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                value={name}
                                onChange={this.handleFieldChange}
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
