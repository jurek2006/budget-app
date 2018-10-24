import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";

export class AddCategory extends Component {
    state = {
        name: ""
    };

    onChange = e => {
        this.setState({ [e.target.name]: e.target.value });
    };

    onSubmit = e => {
        e.preventDefault();

        const newCategory = this.state;

        const { firestore, history } = this.props;

        if (!(newCategory.name.trim() === "")) {
            firestore
                .add({ collection: "categories" }, newCategory)
                .then(() => history.push("/categories"));
        }
    };

    render() {
        return (
            <div className="card m-2">
                <div className="card-header">
                    <h2>Dodaj nową kategorię</h2>{" "}
                </div>
                <div className="card-body">
                    <form onSubmit={this.onSubmit}>
                        <div className="from-group">
                            <label htmlFor="name">Nazwa kategorii:</label>
                            <input
                                type="text"
                                name="name"
                                className="form-control"
                                minLength="2"
                                required
                                value={this.state.name}
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

AddCategory.propType = {
    firestore: PropTypes.object.isRequired
};

export default firestoreConnect()(AddCategory);
