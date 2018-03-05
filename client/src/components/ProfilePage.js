import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import { encryptIt } from "./LoginModal";

import { updateData } from "../actions/auth";

export class ProfilePage extends React.Component {
    state = {
        page: "info",
        user: {
            email: this.props.user.email,
            username: this.props.user.username,
            createdAt: this.props.user.createdAt,
            avatar: this.props.user.avatar
        },
        password: "",
        repeatedPassword: "",
        errorMessage: "",
        successMessage: ""
    }

    onTabClick = (e) => this.setState(() => ({ page: e, errorMessage: "", successMessage: "", password: "", repeatedPassword: "" }));

    onUsernameChange = (e) => {
        let username = e.target.value;
        this.setState((prevState) => ({
            user: {
                ...prevState.user,
                username
            }
        }));
    }

    onPasswordChange = (e) => {
        let password = e.target.value;
        this.setState(() => ({ password }))
    }

    onrepeatedPasswordChange = (e) => {
        let repeatedPassword = e.target.value;
        this.setState(() => ({ repeatedPassword }))
    }

    onSaveChangesClick = async () => {
        if (this.state.page === "info") {
            try {
                let { data: updates } = await axios.patch("/api/user/update", { ...this.state.user });
                this.props.updateData(updates);
                this.setState(() => ({ successMessage: "Personal data updated with success!", errorMessage: "" }));
            } catch (e) {
                this.setState(() => ({ errorMessage: e.response.data.error, successMessage: "" }))
            }
        } else if (this.state.page === "password") {
            let errorMessage = "";
            if (this.state.password.length < 4) {
                errorMessage = "The password minimum length is 4 characters!";
            } else if (this.state.password !== this.state.repeatedPassword) {
                errorMessage = "The two passwords dont match!";
            }
            if (errorMessage) return this.setState(() => ({ errorMessage }));

            try {
                await axios.patch("/api/user/update-password", { password: encryptIt(this.state.password) });
                this.setState(() => ({ successMessage: "Password update with success!", errorMessage: "", password: "", repeatedPassword: "" }));
            } catch (e) {
                this.setState(() => ({ errorMessage: e.response.data.error, successMessage: "" }))
            }
        } else if (this.state.page === "avatar") {
            //validate file size and type before making api request
        }
    }

    onDeleteClick = () => {

    }


    render() {
        return (
            <div className="container">
                <section className="hero is-primary is-bold is-small promo-block">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                <i className="fas fa-id-card" /> Your
                                identification
                            </h1>
                            <h2 className="subtitle">
                                Make changes to your information
                            </h2>
                        </div>
                    </div>
                </section>
                <div className="bg-white">
                    <div className="tabs">
                        <ul>
                            <li className={this.state.page === "info" ? "is-active" : ""}><a onClick={() => this.onTabClick("info")}>Info</a></li>
                            <li className={this.state.page === "password" ? "is-active" : ""}><a onClick={() => this.onTabClick("password")}>Change Password</a></li>
                            <li className={this.state.page === "avatar" ? "is-active" : ""}><a onClick={() => this.onTabClick("avatar")}>Change Avatar</a></li>
                        </ul>
                    </div>
                </div>
                <div className="bg-white mg-top-medium">
                    <div className="section">
                        <div className="size-small">
                            {this.state.page === "info" && (<div>
                                <figure className="image is-128x128 margin-auto">
                                    <img src={"data:image/jpeg;base64," + this.state.user.avatar} alt="user avatar" />
                                </figure>
                                <div className="field mg-top-medium">
                                    <p className="control has-icons-left">
                                        <input className="input is-info" type="text" value={this.state.user.email} disabled />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-envelope"></i>
                                        </span>
                                    </p>
                                </div>
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input className="input is-info" type="text" placeholder="Username" value={this.state.user.username} onChange={this.onUsernameChange} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-user"></i>
                                        </span>
                                    </p>
                                </div>
                                <p>Created on <i className="far fa-clock"></i> {moment(parseInt(this.state.user.createdAt, 10)).format(" Do MMMM YYYY")}</p>
                            </div>)}
                            {this.state.page === "password" && (<div>
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input className="input is-info" type="password" placeholder="Password" value={this.state.password} onChange={this.onPasswordChange} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock" />
                                        </span>
                                    </p>
                                </div>
                                <div className="field">
                                    <p className="control has-icons-left">
                                        <input className="input is-info" type="password" placeholder="Repeat Password" value={this.state.repeatedPassword} onChange={this.onrepeatedPasswordChange} />
                                        <span className="icon is-small is-left">
                                            <i className="fas fa-lock" />
                                        </span>
                                    </p>
                                </div>
                            </div>)}
                            {this.state.page === "avatar" && (<div>
                                Avatar
                                </div>)}
                            {this.state.errorMessage && (
                                <p className="notification is-danger mg-top-small">
                                    {this.state.errorMessage}
                                </p>
                            )}

                            {this.state.successMessage && (
                                <p className="notification is-success mg-top-small">
                                    {this.state.successMessage}
                                </p>
                            )}
                            <p className="has-text-centered mg-top-small"><button className="button is-primary" onClick={this.onSaveChangesClick}><i className="fas fa-check mg-right-tiny"></i> Save changes</button> {this.state.page === "info" && (<button className="button is-danger" onClick={this.onDeleteClick}><i className="fas fa-trash-alt mg-right-tiny"></i> Delete</button>)}</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    user: state.auth
})

const mapDispatchToProps = (dispatch) => ({
    updateData: (updates) => dispatch(updateData(updates))
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);