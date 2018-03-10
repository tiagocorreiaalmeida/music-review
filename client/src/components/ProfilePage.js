import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";

import { encryptIt } from "./LoginModal";
import { updateData } from "../actions/auth";
import { startLogout } from "../actions/auth";

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
        successMessage: "",
        fileName: "",
        file: {},
        modalIsActive: false
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
            let data = new FormData();
            data.append("avatar", this.state.file);
            try {
                let { data: avatar } = await axios.patch("/api/user/avatar", data);
                this.props.updateData({ avatar });
                this.setState((prevState) => ({ user: { ...prevState.user, avatar }, successMessage: "Your avatar was updated with success!", errorMessage: "", file: {}, fileName: "" }));
            } catch (e) {
                this.setState(() => ({ errorMessage: e.response.data.error, successMessage: "" }))
            }
        }
    }

    onDeleteClick = async () => {
        this.setState(() => ({ modalIsActive: true }))
    }

    onDeleteAccountClick = async () => {
        try {
            await axios.delete("/api/user/");
            this.props.logout();
        } catch (e) {
            this.setState(() => ({ errorMessage: e.response.data.error, successMessage: "" }));
        }
    }

    onImageUpload = (e) => {
        if (e.target.files.length > 0) {
            let file = e.target.files[0]
            let { name: fileName, type, size } = file;
            if (!file) {
                this.setState(() => ({ errorMessage: "Upload an image before making the request!", successMessage: "" }));
            } else if (type !== "image/jpeg" && type !== "image/png") {
                this.setState(() => ({ errorMessage: "Invalid file type, the valid formats are JPG and PNG", successMessage: "" }));
            } else if (size / 1000000 > 2) {
                this.setState(() => ({ errorMessage: "The avatar you have chosen exceeds the limit(2mb) size!", successMessage: "" }));
            } else {
                this.setState(() => ({ file, fileName, errorMessage: "", successMessage: "" }));
            }
        }
    }

    closeModal = () => {
        this.setState(() => ({ modalIsActive: false }))
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
                            {this.state.page === "info" && (<div className="fadeIn">
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
                            {this.state.page === "password" && (<div className="fadeIn">
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
                            {this.state.page === "avatar" && (<div className="fadeIn">
                                <div className="file has-name is-boxed is-info is-centered">
                                    <label className="file-label">
                                        <input className="file-input" type="file" name="resume" onChange={this.onImageUpload} />
                                        <span className="file-cta">
                                            <span className="file-icon">
                                                <i className="fas fa-upload"></i>
                                            </span>
                                            <span className="file-label">
                                                Choose a file…
                                            </span>
                                        </span>
                                        <span className="file-name">
                                            {this.state.fileName ? this.state.fileName : "No file selected!"}
                                        </span>
                                    </label>
                                </div>
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
                <div className={`modal ${this.state.modalIsActive && "is-active"}`}>
                    <div
                        className="modal-background bg-light"
                        onClick={this.closeModal}
                    />
                    <div className="modal-card size-small">
                        <header className="modal-card-head">
                            <p className="modal-card-title">Delete Account</p>
                            <button className="delete" aria-label="close" onClick={this.closeModal}></button>
                        </header>
                        <section className="modal-card-body">
                            <p>Are you sure you wanna delete your account? All your posts will be deleted and you won't be able to recover neither your account or posts later.</p>
                        </section>
                        <footer className="modal-card-foot">
                            <button className="button is-danger" onClick={this.onDeleteAccountClick}>Delete</button>
                            <button className="button is-primary" onClick={this.closeModal}>Cancel</button>
                        </footer>
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
    updateData: (updates) => dispatch(updateData(updates)),
    logout: () => dispatch(startLogout())
})

export default connect(mapStateToProps, mapDispatchToProps)(ProfilePage);