import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import DatePicker from "react-datepicker";
import "../../../node_modules/react-datepicker/dist/react-datepicker.css";
import moment from "moment";

export class BudgetOperationDetails extends Component {
    state = {
        date: null, //date as Moment or null if not given
        isEditingOn: false
    };

    static getDerivedStateFromProps(props, state) {
        // if got operation data from firestore set it to the state
        if (props.operation && props.operation.id !== state.id) {
            const { date, value, name, id, category } = props.operation;
            return {
                id,
                value,
                name,
                category,
                date: date
                    ? moment(date.toDate()) //converts date from firestore type to Moment which is used by DatePicker
                    : null
            };
        }
        return null;
    }

    handleSubmit = e => {
        e.preventDefault();

        const { firestore, history } = this.props;
        const { name, date, value, category, id } = this.state;

        if (
            Number(value) > 0 &&
            name.trim().length > 0 &&
            date &&
            category &&
            category.trim().length > 0
        ) {
            firestore
                .get({ collection: "categories", doc: category }) //find category in firestore to get its reference
                .then(categoryRef => {
                    if (categoryRef.exists) {
                        // if category document exists in firebase - save operation with reference to chosen category
                        firestore.update(
                            { collection: "budgetOperations", doc: id },
                            {
                                name,
                                category: categoryRef.ref, //story reference to the category
                                value: Number(value),
                                date: date ? date.toDate() : null //convert date from moment to JS Data (handled in firestore)
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
        const { operation, categories } = this.props;
        if (operation && categories) {
            const { date, value, name, id, category, isEditingOn } = this.state;
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
                        <form onSubmit={this.handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="date">Data:</label>
                                <DatePicker
                                    selected={date}
                                    onChange={this.handleDateChange}
                                    placeholderText="Wybierz datę"
                                    dateFormat="DD.MM.YYYY"
                                    className="form-control"
                                    disabled={!isEditingOn}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="value">Wartość:</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    name="value"
                                    className="form-control"
                                    value={value}
                                    onChange={this.handleFieldChange}
                                    disabled={!isEditingOn}
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
                                    disabled={!isEditingOn}
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
                                    disabled={!isEditingOn}
                                    value={category ? category.id : ""}
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
    firestore: PropTypes.object.isRequired,
    operation: PropTypes.object
};

export default compose(
    firestoreConnect(props => [
        {
            collection: "budgetOperations",
            storeAs: "operation",
            doc: props.match.params.id
        },
        {
            collection: "categories"
        }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        operation:
            ordered.operation &&
            ordered.operation.find(
                operation => operation.id === props.match.params.id
            ),
        categories: ordered.categories
    }))
)(BudgetOperationDetails);
