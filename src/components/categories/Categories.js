import React, { Component } from "react";
import PropTypes from "prop-types";
import { compose } from "redux";
import { connect } from "react-redux";
import { firestoreConnect } from "react-redux-firebase";

export class Categories extends Component {
    render() {
        const { categories } = this.props;

        if (categories) {
            return (
                <div className="card m-2">
                    <h1 className="card-header ">Kategorie</h1>
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
            return <h1>Loading...</h1>;
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
