import React from "react";
import moment from "moment";
import { connect } from "react-redux";
import axios from "axios";
import { Link } from "react-router-dom";

import { startLikePost } from "../actions/myPosts";
import { updateNavbar } from "../actions/navbar";

export class PostInfo extends React.Component {
    onLikeClick = () => {
        if (!this.props.userID)
            return this.props.updateNavbar({
                modalIsActive: true
            });


        if (!this.state.likes.includes(this.props.userID)) {
            this.setState((prevState) => ({ likes: [...prevState.likes, this.props.userID] }))
        } else {
            this.setState((prevState) => ({ likes: prevState.likes.filter((ele) => ele !== this.props.userID) }))
        }

        this.props.like(this.props.postID);

    }
    state = {
        title: "",
        username: "",
        createdAt: "",
        cover: "",
        review: "",
        likes: [],
        avatar: ""
    }
    componentDidMount() {
        axios.get(`/api/post/?postid=${this.props.postID}`).then((res) => {
            if (res.data.length < 1) return this.props.history.push("/");
            this.setState(() => ({
                title: res.data[0].title,
                username: res.data[0].author.username,
                createdAt: res.data[0].createdAt,
                cover: res.data[0].albumCover,
                review: res.data[0].review,
                likes: [...res.data[0].likes],
                link: res.data[0].albumLink,
                avatar: res.data[0].author.avatar
            }))

        }).catch((e) => this.props.history.push("/"))
    }
    render() {
        return (
            <div className="container">
                <div className="column is-8 is-offset-2">
                    <div className="card article">
                        <div className="card-content">
                            <div className="media">
                                <Link to={`/user/${this.state.username}`}>
                                    <img src={"data:image/jpeg;base64," + this.state.avatar} alt="user avatar" className="author-image" />
                                </Link>
                                <div
                                    className="media-content has-text-centered"
                                >
                                    <p className="title article-title">
                                        {this.state.title}
                                    </p>
                                    <p className="subtitle is-6 article-subtitle">
                                        <Link to={`/user/${this.state.username}`}>
                                            @{this.state.username}
                                        </Link>
                                        , on
                            {moment(
                                            Number(this.state.createdAt)
                                        ).format(" Do MMMM YYYY")}
                                    </p>
                                    <img
                                        src={this.state.cover}
                                        className="article-cover--2"
                                        alt="album cover"
                                    />
                                </div>
                            </div>

                            <div className="content article-body">
                                <p className="review article-paragraph">
                                    {this.state.review}
                                </p>
                                <a href={this.state.link} className="article__play" target="_blank">Listen to it on  <i className="fab fa-spotify article__play__icon"></i></a>
                                <button
                                    className="button is-primary is-size-5 has-text-weight-bold"
                                    onClick={this.onLikeClick}
                                >
                                    {this.state.likes.length}
                                    <i className="fas fa-thumbs-up mg-left-small" />
                                </button>
                                {this.state.likes.includes(
                                    this.props.userID
                                ) && (
                                        <p className="has-text-grey mg-top-small">
                                            <i className="fas fa-check" /> You liked
                                            this post.
                                    </p>)}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => ({
    postID: props.match.params.id,
    userID: state.auth._id
})

const mapDispatchToProps = (dispatch) => ({
    like: id => dispatch(startLikePost(id)),
    updateNavbar: updates => dispatch(updateNavbar(updates))
})

export default connect(mapStateToProps, mapDispatchToProps)(PostInfo);

