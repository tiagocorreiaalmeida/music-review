import React from "react";
import validator from "validator";
import axios from "axios";
import bcrypt from "bcryptjs";
import { connect } from "react-redux";

import { startLogin } from "../actions/auth";
import { updateNavbar } from "../actions/navbar";

export const encryptIt = password =>
    bcrypt.hashSync(password, process.env.REACT_APP_SALT);

export class LoginModal extends React.Component {
    state = {
        login: true,
        email: "",
        username: "",
        password: "",
        repeatedPassword: "",
        error: "",
        successMessage: ""
    };

    onModalClose = () => this.props.updateNavbar({ modalIsActive: false });

    onEmailChange = e => {
        let email = e.target.value;
        this.setState(() => ({ email }));
    };

    onUsernameChange = e => {
        let username = e.target.value;
        this.setState(() => ({ username }));
    };

    onPasswordChange = e => {
        let password = e.target.value;
        this.setState(() => ({ password }));
    };

    onRepeatedPasswordChange = e => {
        let repeatedPassword = e.target.value;
        this.setState(() => ({ repeatedPassword }));
    };

    onStatusChange = () =>
        this.setState(prevState => ({
            login: !prevState.login,
            email: "",
            username: "",
            password: "",
            repeatedPassword: "",
            error: "",
            successMessage: ""
        }));



    onSubmit = e => {
        e.preventDefault();
        let error = "";

        if (!validator.isEmail(this.state.email))
            return this.setState(() => ({ error }));

        if (!this.state.login) {
            if (this.state.username.length < 2) {
                error = "The username minimum length is 2 characters!";
            } else if (this.state.password.length < 4) {
                error = "The password minimum length is 4 characters!";
            } else if (this.state.password !== this.state.repeatedPassword) {
                error = "The two passwords dont match!";
            }

            if (error) return this.setState(() => ({ error }));

            axios
                .post("/api/user/register", {
                    email: this.state.email,
                    username: this.state.username,
                    password: encryptIt(this.state.password)
                })
                .then(response => {
                    this.setState(() => ({
                        error: "",
                        successMessage: "Your account has been created!",
                        email: "",
                        username: "",
                        password: "",
                        repeatedPassword: ""
                    }));
                })
                .catch(e =>
                    this.setState(() => ({
                        successMessage: "",
                        error: e.response.data.error
                    }))
                );
        } else {
            axios
                .post("/api/user/login", {
                    email: this.state.email,
                    password: encryptIt(this.state.password)
                })
                .then(response => this.props.login(response.data))
                .catch(e =>
                    this.setState(() => ({
                        successMessage: "",
                        error: e.response.data.error
                    }))
                );
        }
    };

    render() {
        return (
            <div className={`modal ${this.props.modalIsActive && "is-active"}`}>
                <div
                    className="modal-background bg-light"
                    onClick={this.onModalClose}
                />
                <div className="modal-content size-small">
                    <div className="card">
                        <div className="hero is-primary is-small">
                            <div className="hero-body">
                                <h1 className="title">
                                    {this.state.login ? "Sign In" : "Sign Up"}
                                </h1>
                            </div>
                        </div>

                        <div className="card-content">
                            <form onSubmit={this.onSubmit}>
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input
                                            className="input is-primary"
                                            type="email"
                                            placeholder="Email"
                                            value={this.state.email}
                                            onChange={this.onEmailChange}
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-envelope" />
                                        </span>
                                    </p>
                                </div>
                                {!this.state.login && (
                                    <div className="field">
                                        <p className="control has-icons-left">
                                            <input
                                                className="input is-primary"
                                                type="text"
                                                placeholder="username"
                                                value={this.state.username}
                                                onChange={this.onUsernameChange}
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-user" />
                                            </span>
                                        </p>
                                    </div>
                                )}

                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input
                                            className="input is-primary"
                                            type="password"
                                            placeholder="Password"
                                            value={this.state.password}
                                            onChange={this.onPasswordChange}
                                        />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock" />
                                        </span>
                                    </p>
                                </div>
                                {!this.state.login && (
                                    <div className="field">
                                        <p className="control has-icons-left">
                                            <input
                                                className="input is-primary"
                                                type="password"
                                                placeholder="Repeat your password"
                                                value={
                                                    this.state.repeatedPassword
                                                }
                                                onChange={
                                                    this
                                                        .onRepeatedPasswordChange
                                                }
                                            />
                                            <span className="icon is-small is-left">
                                                <i className="fas fa-lock" />
                                            </span>
                                        </p>
                                    </div>
                                )}
                                {this.state.error && (
                                    <p className="notification is-danger">
                                        <i className="fas fa-exclamation-circle" />{" "}
                                        {this.state.error}
                                    </p>
                                )}

                                {this.state.successMessage && (
                                    <p className="notification is-primary">
                                        <i className="fas fa-check-circle" />
                                        {this.state.successMessage}
                                    </p>
                                )}

                                <button className="button is-primary is-outlined">
                                    {this.state.login ? "Login" : "Register"}
                                </button>
                            </form>
                            <a
                                onClick={this.onStatusChange}
                                className="is-size-4 has-text-grey"
                            >
                                {this.state.login
                                    ? "Dont have an account yet? Sign Up"
                                    : "Allready have an account? Sign In"}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    modalIsActive: state.navbar.modalIsActive
});

const mapDispatchToProps = dispatch => ({
    login: userData => dispatch(startLogin(userData)),
    updateNavbar: changes => dispatch(updateNavbar(changes))
});

export default connect(mapStateToProps, mapDispatchToProps)(LoginModal);
