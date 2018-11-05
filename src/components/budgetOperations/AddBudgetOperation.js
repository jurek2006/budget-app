import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import { compose } from "redux";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

export class AddBudgetOperation extends Component {
    state = {
        date: null,
        value: "",
        name: "",
        category: ""
    };

    handleSubmit = e => {
        // if form fields filled - stores operation in firestore
        e.preventDefault();
        const { name, date, value, category } = this.state;
        if (
            !Number.isNaN(value) &&
            name.trim().length > 0 &&
            date &&
            category &&
            category.trim().length > 0
        ) {
            const { firestore, history } = this.props;
            firestore
                .get({ collection: "categories", doc: category }) //find category in firestore to get its reference
                .then(categoryRef => {
                    if (categoryRef.exists) {
                        // if category document exists in firebase - save operation with reference to chosen category
                        firestore.add(
                            { collection: "budgetOperations" },
                            {
                                name,
                                value: Number(value),
                                date: date && date.toDate(), //convert data from moment
                                category: categoryRef.ref //store reference to the category instead of id
                            }
                        );
                    } else {
                        // got reference which points to not existing document
                        throw new Error("Category not found");
                    }
                })
                .then(() => history.push("/operations"))
                .catch(err => {
                    // TODO: handle when storing operation unsuccessful
                    console.log(err);
                });
        } else {
            // TODO: handle form fields validation
        }
    };

    handleFieldChange = e => {
        this.setState({ [e.target.name]: e.target.value.trim() });
    };

    handleDateChange = date => {
        this.setState({ date });
    };

    render() {
        const { categories } = this.props;
        if (categories) {
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
                                    step="0.01"
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
                            <div className="form-group">
                                <label htmlFor="category-select">
                                    Kategoria:
                                </label>

                                <select
                                    name="category"
                                    className="form-control"
                                    onChange={this.handleFieldChange}
                                >
                                    <option value="">
                                        -- Wybierz kategorię --
                                    </option>
                                    {categories.map(category => (
                                        <option
                                            key={category.id}
                                            value={category.id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
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
        } else {
            return <Spinner />;
        }
    }
}

AddBudgetOperation.propTypes = {
    firestore: PropTypes.object.isRequired,
    categories: PropTypes.array
};

export default compose(
    firestoreConnect([{ collection: "categories" }]),
    connect((state, props) => ({
        categories: state.firestore.ordered.categories
    }))
)(AddBudgetOperation);
