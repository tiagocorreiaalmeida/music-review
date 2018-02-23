import React from "react";
import { connect } from "react-redux";
import axios from "axios";

export class ActivateAccountPage extends React.Component {
    state = {
        success: false
    };
    componentDidMount() {
        if (this.props.authenticated) return this.props.history.push("/");
        let key = decodeURIComponent(this.props.activateKey);
        axios
            .get(`/api/user/activate/${key}`)
            .then(response => this.setState(() => ({ success: true })))
            .catch(e => this.setState(() => ({ success: false })));
    }
    render() {
        return (
            <div className="container">
                {this.state.success ? (
                    <div className="notification is-primary">
                        <strong>Your account was activated with success</strong>{" "}
                        Login in and start sharing your music opinion with the
                        world!
                    </div>
                ) : (
                    <div className="notification  is-danger">
                        <strong>Invalid link!</strong> Please verify your email
                        in order to have a valid activation key!
                    </div>
                )}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    authenticated: !!state.auth._id,
    activateKey: props.match.params.key
});

export default connect(mapStateToProps)(ActivateAccountPage);
