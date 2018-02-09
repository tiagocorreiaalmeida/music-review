import React from "react";
import { NavLink } from "react-router-dom";

import LoginModal from "./LoginModal";

export default class Header extends React.Component {
    state = {
        burgerIsActive: false,
        modalIsActive: false
    };

    onBurgerClick = () =>
        this.setState(prevState => ({
            burgerIsActive: !prevState.burgerIsActive
        }));

    OnModalClick = () =>
        this.setState(() => ({
            modalIsActive: true
        }));

    onModalClose = () =>
        this.setState(() => ({
            modalIsActive: false
        }));

    render() {
        return (
            <div>
                <nav className="navbar is-fixed-top is-light">
                    <div className="container">
                        <div className="navbar-brand">
                            <NavLink to="/" className="navbar-item is-size-2">
                                <i className="fas fa-headphones" />
                            </NavLink>
                            <button
                                className={`button navbar-burger ${this.state
                                    .burgerIsActive && "is-active"}`}
                                onClick={this.onBurgerClick}
                            >
                                <span />
                                <span />
                                <span />
                            </button>
                        </div>
                        <div
                            className={`navbar-menu ${this.state
                                .burgerIsActive && "is-active"}`}
                        >
                            <div className="navbar-end">
                                <NavLink
                                    to="/"
                                    className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                    activeClassName="navbar-item--active"
                                >
                                    Home
                                </NavLink>
                                <NavLink
                                    to="/myposts"
                                    className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                    activeClassName="navbar-item--active"
                                >
                                    My posts
                                </NavLink>
                                <NavLink
                                    to="/addpost"
                                    className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                    activeClassName="navbar-item--active"
                                >
                                    Create Post
                                </NavLink>
                                <NavLink
                                    to="/profile"
                                    className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                    activeClassName="navbar-item--active"
                                >
                                    Profile
                                </NavLink>
                                <a
                                    className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                    onClick={this.OnModalClick}
                                >
                                    Login
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
                <LoginModal
                    onModalClose={this.onModalClose}
                    modalIsActive={this.state.modalIsActive}
                />
            </div>
        );
    }
}
