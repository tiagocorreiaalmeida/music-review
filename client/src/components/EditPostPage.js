import React from "react";
import { connect } from "react-redux";

import PostForm from "./PostForm";
import { startEditPost, startRemovePost } from "../actions/myPosts";
import { setMessagesToDefault } from "../actions/messages";

export class EditPostPage extends React.Component {
    state = {
        timer: false,
        loading: true
    };

    componentDidMount() {
        this.props.setMessagesToDefault();
        if (!this.props.post) return this.props.history.push("/");
        this.setState(() => ({ loading: false }));
    }

    componentWillUnmount() {
        if (this.state.timer !== false) clearTimeout(this.state.timer);
    }

    onSubmit = post =>
        this.props.editPost(this.props.post._id, post).then(() =>
            setTimeout(() => {
                if (!this.props.errorMessage)
                    this.setState(() => ({
                        timer: setTimeout(
                            () => this.props.history.push("/myposts"),
                            2500
                        )
                    }));
            })
        );

    onRemove = () => {
        this.props.removePost(this.props.post._id);
        this.props.history.push("/myposts");
    };

    render() {
        return (
            <div className="container">
                {
                    this.state.loading ? (
                        <div className="sk-circle">
                            <div className="sk-circle1 sk-child"></div>
                            <div className="sk-circle2 sk-child"></div>
                            <div className="sk-circle3 sk-child"></div>
                            <div className="sk-circle4 sk-child"></div>
                            <div className="sk-circle5 sk-child"></div>
                            <div className="sk-circle6 sk-child"></div>
                            <div className="sk-circle7 sk-child"></div>
                            <div className="sk-circle8 sk-child"></div>
                            <div className="sk-circle9 sk-child"></div>
                            <div className="sk-circle10 sk-child"></div>
                            <div className="sk-circle11 sk-child"></div>
                            <div className="sk-circle12 sk-child"></div>
                        </div>
                    ) : (
                            <div>
                                <section className="hero is-success is-bold is-small promo-block">
                                    <div className="hero-body">
                                        <div className="container">
                                            <h1 className="title">
                                                <i className="fas fa-edit mg-right-small" />
                                                {`Editing ${this.props.post.title}`}
                                            </h1>
                                            <h2 className="subtitle">
                                                Make all the changes needed
                                    </h2>
                                        </div>
                                    </div>
                                </section>
                                <PostForm
                                    onSubmit={this.onSubmit}
                                    post={this.props.post}
                                    onRemove={this.onRemove}
                                />
                            </div>
                        )
                }
            </div>
        );
    }
}

const mapStateToProps = (state, props) => ({
    post: state.myPosts.find(post => post._id === props.match.params.id),
    errorMessage: state.messages.errorMessage
});

const mapDispatchToProps = dispatch => ({
    editPost: (id, post) => dispatch(startEditPost(id, post)),
    removePost: id => dispatch(startRemovePost(id)),
    setMessagesToDefault: () => dispatch(setMessagesToDefault())
});

export default connect(mapStateToProps, mapDispatchToProps)(EditPostPage);
