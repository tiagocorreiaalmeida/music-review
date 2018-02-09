import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import DashboardPage from "../components/DashboardPage";
import Header from "../components/Header";
import ProfilePage from "../components/ProfilePage";
import AddPostPage from "../components/AddPostPage";
import MyPostsPage from "../components/MyPostsPage";

const AppRouter = () => (
    <BrowserRouter>
        <div>
            <Header />
            <Switch>
                <Route path="/" component={DashboardPage} exact={true} />
                <Route path="/myposts" component={MyPostsPage} exact={true} />
                <Route path="/addpost" component={AddPostPage} exact={true} />
                <Route path="/profile" component={ProfilePage} exact={true} />
            </Switch>
        </div>
    </BrowserRouter>
)

export default AppRouter;