import React from "react";

export default class LoginModal extends React.Component {
    state = {
        login: true
    };
    render() {
        return (
            <div className={`modal ${this.props.modalIsActive && "is-active"}`}>
                <div
                    className="modal-background bg-light"
                    onClick={this.props.onModalClose}
                />
                <div className="modal-content">
                    <div className="card">
                        <div className="hero is-primary is-small">
                            <div class="hero-body">
                                <h1 class="title">Primary title</h1>
                            </div>
                        </div>
                        <div className="card-content">
                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input
                                        className="input is-primary"
                                        type="email"
                                        placeholder="Email"
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-envelope" />
                                    </span>
                                    <span className="icon is-small is-right">
                                        <i className="fas fa-check" />
                                    </span>
                                </p>
                            </div>
                            <div className="field">
                                <p className="control has-icons-left has-icons-right">
                                    <input
                                        className="input is-primary"
                                        type="password"
                                        placeholder="Password"
                                    />
                                    <span className="icon is-small is-left">
                                        <i className="fas fa-lock" />
                                    </span>
                                    <span className="icon is-small is-right">
                                        <i className="fas fa-check" />
                                    </span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}
