import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import LoginModal from "./LoginModal";
import { updateNavbar } from "../actions/navbar";
import { startLogout } from "../actions/auth";

export class Header extends React.Component {
    onBurgerClick = () =>
        this.props.updateNavbar({ burgerIsActive: !this.props.burgerIsActive });

    OnModalClick = () => {
        this.props.updateNavbar({ modalIsActive: !this.props.modalIsActive });
        this.onBurgerClick();
    };

    onLogoutClick = () => this.props.logout();

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
                                className={`button navbar-burger ${this.props
                                    .burgerIsActive && "is-active"}`}
                                onClick={this.onBurgerClick}
                            >
                                <span />
                                <span />
                                <span />
                            </button>
                        </div>
                        <div
                            className={`navbar-menu ${this.props
                                .burgerIsActive && "is-active"}`}
                        >
                            {this.props.isAuthenticated ? (
                                <div className="navbar-end">
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/"
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        Home
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/myposts"
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        My posts
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/addpost"
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        Create Post
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/profile"
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        Profile
                                    </NavLink>
                                    <a
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        onClick={this.onLogoutClick}
                                    >
                                        Logout
                                    </a>
                                </div>
                            ) : (
                                <div className="navbar-end">
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/"
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        Home
                                    </NavLink>
                                    <a
                                        className="navbar-item is-size-6 is-uppercase has-text-weight-semibold"
                                        onClick={this.OnModalClick}
                                    >
                                        Login
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                </nav>
                {!this.props.isAuthenticated && <LoginModal />}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    isAuthenticated: !!state.auth._id,
    burgerIsActive: state.navbar.burgerIsActive
});

const dispatchToProps = dispatch => ({
    updateNavbar: changes => dispatch(updateNavbar(changes)),
    logout: () => dispatch(startLogout())
});

export default connect(mapStateToProps, dispatchToProps)(Header);
