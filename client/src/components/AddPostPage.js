import React from "react";
import PostForm from "./PostForm";

export default class AddPostPage extends React.Component {
    onSubmit = e => {};
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
