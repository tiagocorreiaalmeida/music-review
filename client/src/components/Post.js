import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import moment from "moment";
import axios from "axios";

import { startLikePost, setLikes } from "../actions/myPosts";
import { updateNavbar } from "../actions/navbar";
import { setMessages } from "../actions/messages";
import { setLikesOtherPost } from "../actions/posts";

export class Post extends React.Component {
    state = {
        likes: this.props.post.likes
    }
    onLikeClick = async () => {
        if (this.props.profile) {
            try {
                let { data: likes } = await axios.patch(`/api/post/like/${this.props.post._id}`);
                this.setState(() => ({ likes: [...likes] }));
                this.props.setLikes(this.props.post._id, likes);
                this.props.setLikesPublic(this.props.post._id, likes);
            } catch (e) {
                this.props.setMessages({
                    errorMessage: e.response.data.error,
                    successMessage: ""
                });
            }
        } else {
            if (!this.props.userID)
                return this.props.updateNavbar({
                    modalIsActive: true
                });
            this.props.like(this.props.post._id);
        }
    };

    render() {
        return (
            <div className={`column ${this.props.author ? "is-4" : "is-6"}`}>
                <div className="card article">
                    <div className="card-content">
                        <div className="media">
                            {!this.props.author && (
                                <Link to={`/user/${this.props.post.author.username}`}>
                                    <img src={"data:image/jpeg;base64," + this.props.post.author.avatar} alt="user avatar" className="author-image" />
                                </Link>
                            )}
                            <div
                                className={`media-content has-text-centered ${this
                                    .props.author && "no-margin"}`}
                            >
                                <Link to={`/post/${this.props.post._id}`} >
                                    <p className="title article-title">
                                        {this.props.post.title}
                                    </p>
                                </Link>
                                <p className="subtitle is-6 article-subtitle">
                                    <Link to={`/user/${this.props.post.author.username}`}>
                                        @{this.props.post.author.username}
                                    </Link>
                                    , on
                                    {moment(
                                        Number(this.props.post.createdAt)
                                    ).format(" Do MMMM YYYY")}
                                </p>
                                <img
                                    src={this.props.post.albumCover}
                                    className="article-cover"
                                    alt="album cover"
                                />
                            </div>
                        </div>

                        <div className="content article-body">
                            <p className="review">
                                {this.props.post.review.length > 256
                                    ? this.props.post.review.slice(0, 253) +
                                    "..."
                                    : this.props.post.review}
                            </p>
                            <button
                                className="button is-primary is-size-5 has-text-weight-bold"
                                onClick={this.onLikeClick}
                            >
                                {this.props.profile ? this.state.likes.length : this.props.post.likes.length}
                                <i className="fas fa-thumbs-up mg-left-small" />
                            </button>
                            <Link
                                to={
                                    this.props.author
                                        ? `/edit/${this.props.post._id}`
                                        : `/post/${this.props.post._id}`
                                }
                                className="button is-info is-size-5 has-text-weight-bold mg-left-small"
                            >
                                <p>
                                    <i
                                        className={
                                            this.props.author
                                                ? "fas fa-pencil-alt mg-right-tiny"
                                                : "fas fa-link mg-right-tiny"
                                        }
                                    />
                                    {this.props.author ? "Edit" : "See more"}
                                </p>
                            </Link>
                            {!this.props.profile && this.props.post.likes.includes(
                                this.props.userID
                            ) && (
                                    <p className="has-text-grey mg-top-small">
                                        <i className="fas fa-info-circle" /> You liked
                                        this post.
                                </p>
                                )}
                            {this.props.profile && this.state.likes.includes(this.props.userID) && (
                                <p className="has-text-grey mg-top-small">
                                    <i className="fas fa-info-circle" /> You liked
                                    this post.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    userID: state.auth._id,
    errorMessage: state.messages.errorMessage
});

const mapDispatchToProps = dispatch => ({
    like: id => dispatch(startLikePost(id)),
    updateNavbar: updates => dispatch(updateNavbar(updates)),
    setMessages: (messages) => dispatch(setMessages(messages)),
    setLikes: (id, likes) => dispatch(setLikes(id, likes)),
    setLikesPublic: (id, likes) => dispatch(setLikesOtherPost(id, likes))
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
