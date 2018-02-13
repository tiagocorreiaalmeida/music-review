import React from "react";
import { connect } from "react-redux";

import PostForm from "./PostForm";
import { startAddPost } from "../actions/myPosts";
import { setMessagesToDefault } from "../actions/messages";

export class AddPostPage extends React.Component {
    componentWillMount() {
        this.props.setMessagesToDefault();
    }
    onSubmit = post => {
        this.props.addPost(post);
    };
    render() {
        return (
            <div className="container">
                <section className="hero is-success is-bold is-small promo-block">
                    <div className="hero-body">
                        <div className="container">
                            <h1 className="title">
                                <i className="fas fa-edit mg-right-small" />
                                Create new post
                            </h1>
                            <h2 className="subtitle">
                                Share your opinion with the world
                            </h2>
                        </div>
                    </div>
                </section>
                <PostForm onSubmit={this.onSubmit} />
            </div>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    addPost: post => dispatch(startAddPost(post)),
    setMessagesToDefault: () => dispatch(setMessagesToDefault())
});

export default connect(undefined, mapDispatchToProps)(AddPostPage);
