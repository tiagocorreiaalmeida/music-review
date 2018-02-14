import React from "react";
import { connect } from "react-redux";

import PostForm from "./PostForm";
import { startEditPost, startRemovePost } from "../actions/myPosts";
import { setMessagesToDefault } from "../actions/messages";

export class EditPostPage extends React.Component {
    componentWillMount() {
        this.props.setMessagesToDefault();
    }

    componentDidMount() {
        console.log(this.props.post);
    }

    onSubmit = post => {
        this.props.editPost(this.props.post._id, post);
    };

    onRemove = () => {
        this.props.removePost(this.props.post._id);
        this.props.history.push("/myposts");
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
                <PostForm onSubmit={this.onSubmit} post={this.props.post} />
                <button onClick={this.onRemove}>Delete</button>
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    post: state.myPosts.find(post => post._id === props.match.params.id)
});

const mapDispatchToProps = dispatch => ({
    editPost: (id, post) => dispatch(startEditPost(id, post)),
    removePost: id => dispatch(startRemovePost(id)),
    setMessagesToDefault: () => dispatch(setMessagesToDefault())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPostPage);
