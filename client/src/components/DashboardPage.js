import React from "react";
import { Link } from "react-router-dom";

import testImg from "../images/albumtest.jpeg";

export default class DashboardPage extends React.Component {
    render() {
        return (
            <div className="container">
                <section className="articles">
                    <section className="hero is-info is-bold is-small promo-block">
                        <div className="hero-body">
                            <div className="container">
                                <h1 className="title">
                                    <i className="fas fa-bullhorn mg-right-small" />
                                    Latest posts
                                </h1>
                                <h2 className="subtitle">
                                    See the most recent posts created by the
                                    users
                                </h2>
                            </div>
                        </div>
                    </section>
                    <div className="columns is-multiline">
                        <div className="column is-6">
                            <div className="card article">
                                <div className="card-content">
                                    <div className="media">
                                        <div className="media-center">
                                            <img
                                                src="http://www.radfaces.com/images/avatars/daria-morgendorffer.jpg"
                                                className="author-image"
                                                alt="User avatar"
                                            />
                                        </div>
                                        <div className="media-content has-text-centered">
                                            <Link to="/">
                                                <p className="title article-title">
                                                    Introducing a new feature
                                                    for paid subscribers
                                                </p>
                                            </Link>
                                            <p className="subtitle is-6 article-subtitle">
                                                <a href="/userpage">
                                                    @dasdasdasd
                                                </a>{" "}
                                                on October 7, 2017
                                            </p>
                                            <img
                                                src={testImg}
                                                className="article-cover"
                                                alt="album cover"
                                            />
                                        </div>
                                    </div>

                                    <div className="content article-body">
                                        <p>
                                            Non arcu risus quis varius quam
                                            quisque. Dictum varius duis at
                                            consectetur lorem. Posuere
                                            sollicitudin aliquam ultrices
                                            sagittis orci a scelerisque purus
                                            semper.{" "}
                                        </p>
                                        <button className="button is-primary is-size-5 has-text-weight-bold">
                                            532{" "}
                                            <i className="fas fa-thumbs-up mg-left-small" />
                                        </button>
                                        <Link
                                            to="/"
                                            className="button is-info is-size-5 has-text-weight-bold mg-left-small"
                                        >
                                            <p>
                                                <i className="fas fa-link" />{" "}
                                                See more
                                            </p>
                                        </Link>
                                        <p className="has-text-grey">
                                            <i className="fas fa-check" /> You
                                            liked this post.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        );
    }
}
