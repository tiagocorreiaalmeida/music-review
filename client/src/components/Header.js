import React from "react";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";

import LoginModal from "./LoginModal";
import { updateNavbar } from "../actions/navbar";
import { startLogout } from "../actions/auth";
import Logo from "../images/logo.png"

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
                <nav className="navbar is-fixed-top">
                    <div className="container mg-small">
                        <div className="navbar-brand is-centered">
                            <NavLink to="/" className="is-size-2 logo">
                                <img src={Logo} className="logo-img" alt="Music blog" />
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
                                        className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        <i className="fas fa-home"></i>
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/myposts"
                                        className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        <i className="fas fa-list-ul"></i>
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/addpost"
                                        className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        <i className="fas fa-plus"></i>
                                    </NavLink>
                                    <NavLink
                                        onClick={this.onBurgerClick}
                                        to="/profile"
                                        className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                        activeClassName="navbar-item--active"
                                    >
                                        <i className="fas fa-user"></i>
                                    </NavLink>
                                    <a
                                        className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                        onClick={this.onLogoutClick}
                                    >
                                        <i className="fas fa-sign-out-alt"></i>
                                    </a>
                                </div>
                            ) : (
                                    <div className="navbar-end">
                                        <NavLink
                                            onClick={this.onBurgerClick}
                                            to="/"
                                            className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                            activeClassName="navbar-item--active"
                                        >
                                            <i className="fas fa-home"></i>
                                        </NavLink>
                                        <a
                                            className="navbar-item is-size-5 is-uppercase has-text-weight-semibold"
                                            onClick={this.OnModalClick}
                                        >
                                            <i className="fas fa-sign-in-alt"></i>
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