import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";
import Spinner from "../layout/Spinner";
import { Link } from "react-router-dom";

export class Categories extends Component {
    render() {
        const { categories } = this.props;

        if (categories) {
            return (
                <div className="card m-2">
                    <div className="card-header container-fluid">
                        <div className="row align-items-center">
                            <div className="col">
                                <h1>Kategorie</h1>
                            </div>
                            <div className="col-auto">
                                <Link
                                    className="btn btn-primary ml-auto"
                                    to="/categories/add"
                                >
                                    <i className="fas fa-plus" /> Dodaj
                                    kategorię
                                </Link>
                            </div>
                        </div>
                    </div>
                    <ul className="list-group list-group-flush">
                        {categories.map(category => (
                            <li className="list-group-item" key={category.id}>
                                {category.name}
                            </li>
                        ))}
                    </ul>
                </div>
            );
        } else {
            return <Spinner />;
        }
    }
}

Categories.propTypes = {
    firestore: PropTypes.object.isRequired,
    clients: PropTypes.array
};

export default compose(
    firestoreConnect([{ collection: "categories" }]),
    connect((state, props) => ({
        categories: state.firestore.ordered.categories
    }))
)(Categories);
