import React, { Component } from "react";

export class Categories extends Component {
    render() {
        const categories = [
            {
                id: "445635",
                name: "jedzenie"
            },
            {
                id: "3546547",
                name: "rozrywka"
            },
            {
                id: "34457567",
                name: "opłaty"
            }
        ];

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

export default Categories;
