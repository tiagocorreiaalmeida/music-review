import React from "react";

import Posts from "./Posts";

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
                </section>
            </div>
        );
    }
}
