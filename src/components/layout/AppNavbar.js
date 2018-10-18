import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function AppNavbar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-danger">
            <Link className="navbar-brand" to="/">
                Budget App
            </Link>
            <button
                className="navbar-toggler"
                type="button"
                data-toggle="collapse"
                data-target="#navbarMain"
            >
                <span className="navbar-toggler-icon" />
            </button>

            <div className="collapse navbar-collapse" id="navbarMain">
                <ul className="navbar-nav ml-auto">
                    <li className="nav-item">
                        <NavLink exact className="nav-link" to="/">
                            <i className="fas fa-home" /> Panel
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/expenses">
                            <i className="fas fa-money-bill-wave" /> Wydatki
                        </NavLink>
                    </li>
                    <li className="nav-item">
                        <NavLink className="nav-link" to="/categories">
                            <i className="fas fa-tags" /> Kategorie
                        </NavLink>
                    </li>
                </ul>
            </div>
        </nav>
    );
}
