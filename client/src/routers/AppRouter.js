import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import { connect } from "react-redux";

import LoggedRouter from "./LoggedRouter";
import DashboardPage from "../components/DashboardPage";
import Header from "../components/Header";
import ProfilePage from "../components/ProfilePage";
import AddPostPage from "../components/AddPostPage";
import MyPostsPage from "../components/MyPostsPage";
import EditPostPage from "../components/EditPostPage";

import { logBack } from "../actions/auth";

class AppRouter extends React.Component {
    componentWillMount() {
        this.props.logBack();
    }
    render() {
        return (
            <BrowserRouter>
                <div>
                    <Header />
                    <Switch>
                        <Route
                            path="/"
                            component={DashboardPage}
                            exact={true}
                        />
                        <LoggedRouter
                            path="/myposts"
                            component={MyPostsPage}
                            exact={true}
                        />
                        <LoggedRouter
                            path="/addpost"
                            component={AddPostPage}
                            exact={true}
                        />
                        <LoggedRouter
                            path="/edit/:id"
                            component={EditPostPage}
                        />
                        <LoggedRouter
                            path="/profile"
                            component={ProfilePage}
                            exact={true}
                        />
                    </Switch>
                </div>
            </BrowserRouter>
        );
    }
}

const mapDispatchToProps = dispatch => ({
    logBack: () => dispatch(logBack())
});

export default connect(undefined, mapDispatchToProps)(AppRouter);
