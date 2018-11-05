import React, { Component } from "react";
import { firestoreConnect } from "react-redux-firebase";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";

export class EditCategory extends Component {
    constructor(props) {
        super(props);
        // Create refs
        this.nameInput = React.createRef();
    }

    onSubmit = e => {
        e.preventDefault();

        const { category, firestore, history } = this.props;

        // Update category
        const updCategory = { name: this.nameInput.current.value };

        // Update category in firestore
        firestore
            .update({ collection: "categories", doc: category.id }, updCategory)
            .then(() => history.push("/categories"));
    };

    render() {
        const { category } = this.props;
        if (category) {
            return (
                <div>
                    <div className="card m-2">
                        <div className="card-header">
                            <h1>Edytuj kategorię</h1>{" "}
                        </div>
                        <div className="card-body">
                            <form onSubmit={this.onSubmit}>
                                <div className="from-group">
                                    <label htmlFor="name">
                                        Nazwa kategorii:
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        minLength="2"
                                        required
                                        defaultValue={category.name}
                                        ref={this.nameInput}
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
                </div>
            );
        } else {
            return <Spinner />;
        }
    }
}

EditCategory.propType = {
    firestore: PropTypes.object.isRequired,
    category: PropTypes.object.isRequired
};

export default compose(
    firestoreConnect(props => [
        {
            collection: "categories",
            storeAs: "category",
            doc: props.match.params.id
        }
    ]),
    connect(({ firestore: { ordered } }, props) => ({
        category:
            ordered.category &&
            ordered.category.find(cat => cat.id === props.match.params.id)
    }))
)(EditCategory);
